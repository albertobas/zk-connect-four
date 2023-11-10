import math
import random
import numpy as np
import torch
from custom_types import ParamsAgent
from typing import List
from replay import ExperienceReplay, Transition
from utils import get_two_channels
from os.path import join
from pathlib import Path
import torch.nn as nn


class DQNAgent:
    def __init__(self, net: nn.Module, params: ParamsAgent, device: torch.device, load_model_path: str | None = None) -> None:
        self.net = net
        self.criterion = getattr(
            torch.nn, params['criterion']['name'])(**params['criterion']['config'])
        self.memory = ExperienceReplay(maxlen=params['memory__maxlen'],
                                       batch_size=params['batch_size'])
        self.params = params
        self.device = device
        self.eps_threshold = 0.
        if load_model_path is not None:
            self._load(load_model_path)
        self.optimizer = getattr(torch.optim, params['optimizer']['name'])(
            self.net.policy.parameters(), **params['optimizer']['config'])

    def act(self, state: np.ndarray, valid_actions: List[int], num_steps: int, enforce_valid_action: bool) -> int:
        """ 
        Either predicts an action (exploitation) or chooses a random action (exploration) depending on the epsilon threshold.

        Args:
            - `state`: the state in which to predict the action.
            - `valid_actions`: set of valid actions.
            - `num_steps`: current total number of steps taken during training.
            - `enforce_valid_action`: whether to enforce that the action is valid or not.

        Returns:
            - The chosen action.
        """
        self.eps_threshold = self.params['epsilon']['end'] + (self.params['epsilon']['start'] - self.params['epsilon']['end']) \
            * math.exp(-1. * num_steps / self.params['epsilon']['decay'])
        if random.random() > self.eps_threshold:
            # exploit learnt actions while not enforcing it is valid
            return self.exploit(state, valid_actions, enforce_valid_action)

        else:
            # explore actions
            return np.random.choice(valid_actions)

    def cache(self, state: np.ndarray, action: int, next_state: np.ndarray | None, reward: float) -> None:
        """
        Pushes a transition into memory.

        Args:
            - `state`: the state at time t.
            - `action`: the chosen action.
            - `next_state`:  the state at time t + 1.
            - `reward`: the reward after performing the action.
        """
        self.memory.push(state, action, next_state, reward)

    @torch.no_grad()
    def exploit(self, state: np.ndarray, valid_actions: List[int], enforce_valid_action: bool) -> int:
        """ 
        Predicts an action (exploitation). If `enforce_valid_action` is True, it enforces that the action
        is in `valid_actions` (action space).

        Args:
            - `state`: the state in which to predict the action.
            - `valid_actions`: Set of valid actions or None.
            - `enforce_valid_action`: if True, it enforces that the action is valid.

        Returns:
            - The chosen action.
        """
        tensor_state = torch.tensor(
            data=get_two_channels(np.expand_dims(state, 0)),
            dtype=torch.float,
            device=self.device
        )
        output = self.net(tensor_state, 'policy').squeeze().cpu().numpy()
        if enforce_valid_action:
            # only outputs in valid actions can be considered
            all_actions = np.arange(self.params['out_features'])
            valid_actions_mask = [
                action in valid_actions for action in all_actions]
            return int(np.argmax(output == np.max(output[valid_actions_mask]), keepdims=False))

        else:
            return int(np.argmax(output, keepdims=False))

    def optimize(self) -> float:
        """ 
        Performs one step of the optimization on the policy network.

        Returns:
            - The computed loss.
        """
        transitions = self.memory.recall()
        batch = Transition(*zip(*transitions))
        # (batch_size x 2 x observation_space x action_space)
        state_batch = torch.tensor(
            data=get_two_channels(np.stack(batch.state)),
            device=self.device,
            dtype=torch.float
        )
        # (batch_size x 1)
        action_batch = torch.tensor(
            data=np.stack(batch.action),
            device=self.device,
            dtype=torch.long
        ).unsqueeze(1)
        # compute current Q values
        # (batch_size, 1)
        q_pred = self.net(state_batch, 'policy').gather(
            dim=1,
            index=action_batch)
        # compute expected Q values
        # (batch_size, 1)
        q_next = self._get_expected_state_action_values(
            batch.next_state, batch.reward)
        # compute loss
        loss = self.criterion(q_pred, q_next)
        # set gradients to none instead of zero (reduces the number of memory operations)
        self.optimizer.zero_grad(set_to_none=True)
        # compute gradients
        loss.backward()
        # in-place gradient clipping
        if self.params['clip_grads'] is not None:
            getattr(torch.nn.utils,
                    self.params['clip_grads']['name'])(self.net.policy.parameters(), **self.params['clip_grads']['config'])
        # optimize the model
        self.optimizer.step()
        return loss.item()

    def save(self, checkpoints_dir_path: str, model_id: str, current_step: int) -> None:
        """
        Saves the model `model_id`'s `state_dict` and the current `eps_threshold` in `checkpoints_dir_path`.

        Args:
            - `checkpoints_dir_path`: the directory where to save the model.
            - `model_id`:  the id of the model.
            - `current_step`: the current step in the training.
        """
        Path(checkpoints_dir_path).mkdir(
            parents=True,
            exist_ok=True
        )
        model_path = join(checkpoints_dir_path, f'{model_id}.chkpt')
        checkpoint = {
            "state_dict": self.net.state_dict(),
            "eps_threshold": self.eps_threshold
        }
        torch.save(
            obj=checkpoint,
            f=model_path
        )
        print(
            f"Model saved to {model_path} at step {current_step} with epsilon threshold {np.round(self.eps_threshold, 4)}")

    def update_target(self, episode: int) -> None:
        """ 
        Updates the target model either softly or hardly.

        Args:
            - `episode`: current episode of the training.
        """
        if self.params['target_update']['mode'] == 'soft':
            # soft update of the target network's weights
            target_net_state_dict = self.net.target.state_dict()
            policy_net_state_dict = self.net.policy.state_dict()

            for key in policy_net_state_dict:
                target_net_state_dict[key] = policy_net_state_dict[key] * \
                    self.params['target_update']['config']['tau'] + target_net_state_dict[key] * \
                    (1-self.params['target_update']['config']['tau'])

            self.net.target.load_state_dict(target_net_state_dict)

        else:
            # hard update of the target network's weights
            if episode + 1 % self.params['target_update']['config']['period'] == 0:
                self.net.target.load_state_dict(self.net.policy.state_dict())

    @torch.no_grad()
    def _get_expected_state_action_values(self, next_state: tuple, rewards: tuple) -> torch.Tensor:
        """
        Computes expected Q values.

        Args:
            - `next_states`: tuple of next state numpy arrays.
            - `rewards`: tensor with the stacked rewards.
            - `batch_size`: the size of the batch.
        """
        # (batch_size)
        reward_batch = torch.tensor(
            data=np.stack(rewards),
            device=self.device,
            dtype=torch.float
        )
        # (batch_size)
        q_next = torch.zeros(
            size=reward_batch.size(),
            device=self.device
        )
        # batch_size
        non_final_mask = torch.tensor(
            data=tuple(map(lambda s: s is not None, next_state)),
            device=self.device,
            dtype=torch.bool
        )
        # (batch_size - final_states, 2, observation_space, action_space)
        non_final_next_states = torch.tensor(
            data=get_two_channels(np.concatenate(
                [np.expand_dims(s, 0) for s in next_state if s is not None])),
            device=self.device,
            dtype=torch.float
        )

        if self.params['double']:
            # use both policy and target to approximate the q values of the next states
            # (batch_size - final_states, action_space)
            output = self.net(non_final_next_states, 'policy')
            # (batch_size, 1)
            best_actions = output.argmax(1).unsqueeze(1)
            # (batch_size, 1)
            q_pred = self.net(non_final_next_states, 'target').gather(
                dim=1, index=best_actions)
            # use mask to keep q values for non final states zero
            # (batch_size)
            q_next[non_final_mask] = q_pred.squeeze(1)

        else:
            # get the q values of the non-final next states using the target network
            # (batch_size - final_states, action_space)
            output = self.net(non_final_next_states, 'target')
            # (batch_size - final_states)
            q_pred = output.max(1)[0]
            # use mask to keep q values for non final states zero
            # (batch_size)
            q_next[non_final_mask] = q_pred
        # apply the discount factor, subtract from the reward and add a dimension
        # (batch_size, 1)
        return (reward_batch - (self.params['gamma'] * q_next)).unsqueeze(1)

    def _load(self, load_model_path: str):
        """
        Loads the model in `load_model_path`, i.e., sets its `state_dict` to `self.net` and updates `eps_threshold`.

        Args:
            - `load_model_path`: the path to the model that is to be loaded.
        """
        checkpoint_path = Path(load_model_path)
        if not checkpoint_path.exists():
            raise ValueError("The checkpoint path does not exist.")
        check = torch.load(f=checkpoint_path, map_location=self.device)
        eps_threshold = check.get('eps_threshold')
        state_dict = check.get('state_dict')
        self.eps_threshold = eps_threshold
        self.net.load_state_dict(state_dict=state_dict)
        print(
            f"Model at {checkpoint_path} with an epsilon threshold of {eps_threshold} has been loaded")
