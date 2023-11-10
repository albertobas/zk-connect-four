import datetime
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import time
import torch
import torch.nn as nn
from constants import finishes_boards_solutions, blocks_boards_solutions
from custom_types import ParamsTrain, ParamsEval
from typing import List
from agent import DQNAgent
from env import ConnectFourEnv
from replay import Transition
from utils import moving_average, get_actions
from os.path import join
from pathlib import Path

plt.rcParams.update({'axes.grid': True, 'axes.edgecolor': '#ffffff', 'axes.facecolor': '#fafafa',
                     'axes.labelcolor': '#3f3f3f', 'figure.facecolor': '#ffffff', 'font.size': 15,
                     'grid.color': '#dddddd', 'legend.edgecolor': '#ffffff', 'legend.facecolor': '#ffffff',
                     'legend.fontsize': 13, 'xtick.color': '#3f3f3f', 'xtick.labelsize': 14,
                     'ytick.color': '#3f3f3f', 'ytick.labelsize': 14})


def train(agent: DQNAgent, env: ConnectFourEnv,  params_train: ParamsTrain, params_eval: ParamsEval, checkpoints_dir_path: str,
          device: torch.device) -> tuple[pd.DataFrame, pd.DataFrame, list, str]:
    """
    Trains a policy on the Connect Four task. Loss is computed at every episode once 
    the buffer has more transitions than the batch size value.

    Args:
        - `agent`: agent of type `DQNAgent`.
        - `env`: environment of type `ConnectFourEnv`.
        - `params_train`: `ParamsTrain` object with the parameters of the training.
        - `params_eval`: `ParamsEval` object with the parameters of the evaluations.
        - `checkpoints_dir_path`: path to the checkpoints directory.
        - `device`: torch device.

    Returns:
        - Pandas dataframe with the history of the training.
        - Pandas dataframe with the history of the evaluations.
        - List with the values of the running loss at each step.
        - The model id.
    """
    train_history: dict[str, list] = {
        'steps': [],
        'time': [],
        'rewards': [],
        'lr': []
    }
    evaluations: List[list] = []
    evaluations_idcs: List[int] = []
    running_loss: List[float] = []
    eval_columns = [
        'rewards_median', 'rewards_mean', 'rewards_std', 'steps_median', 'steps_mean', 'steps_std', 'win_rate',
        'loss_rate', 'draw_rate', 'fnsh_perc', 'blck_perc'
    ]
    if params_train['scheduler'] is not None:
        scheduler = getattr(torch.optim.lr_scheduler, params_train["scheduler"]['name'])(
            optimizer=agent.optimizer, **params_train['scheduler']['config'])

    print(
        f"Training policy in {agent.net.__class__.__name__}.\n"
        f"{'Episode':^10}{'Step':^10}{'Train rewards (avg)':^20}{'steps (avg)':^14}{'running loss (avg)':^20}"
        f"{'Eval reward (mean std)':^25}{'win rate(%)':^10}{'Eps':^10}{'LR':^6}{'Time':^11}"
    )

    try:
        for episode in range(params_train['episodes']):
            episode_s = time.time()
            transitions = _play_episode(
                agent, env, sum(train_history['steps']), params_train['enforce_valid_action'])
            rewards = 0.
            steps = len(transitions)

            for i in range(len(transitions)):
                if i == len(transitions) - 2:
                    state, action, next_state, reward = transitions[i]
                    if transitions[-1].reward == env.params['rewards']['win']:
                        transition = Transition(
                            state=state,
                            action=action,
                            next_state=next_state,
                            reward=reward + env.params['rewards']['loss']
                        )

                    else:
                        transition = Transition(
                            state=state,
                            action=action,
                            next_state=next_state,
                            reward=reward + env.params['rewards']['draw']
                        )

                else:
                    transition = transitions[i]

                agent.cache(*transition)
                rewards += transition.reward

            if len(agent.memory) >= params_train['batch_size']:
                _optimize(
                    agent=agent,
                    running_loss=running_loss,
                    episode=episode
                )

            train_history['steps'].append(steps)
            train_history['rewards'].append(rewards)
            train_history['time'].append(time.time() - episode_s)
            train_history['lr'].append(agent.optimizer.param_groups[0]['lr'])

            if (len(agent.memory) >= params_train['batch_size']) and ((episode+1) % params_eval['period'] == 0):
                evaluation = _evaluate(
                    agent=agent,
                    env=env,
                    params=params_eval,
                    device=device
                )

                if ((episode+1) % params_train['display_period'] == 0):
                    _print_metrics(
                        agent=agent,
                        evaluation=evaluation,
                        train_history=train_history,
                        params_eval=params_eval,
                        running_loss=running_loss,
                        episode=episode
                    )
                evaluations.append(evaluation)
                evaluations_idcs.append(episode)

            if episode != 0 and params_train['checkpoint']['save_every'] is not None and (episode + 1) % params_train['checkpoint']['save_every'] == 0 \
                    and not (episode == params_train['episodes']-1 and params_train['checkpoint']['save_on_exit'] == True):
                model_id = _get_model_id(agent)
                agent.save(
                    checkpoints_dir_path=checkpoints_dir_path,
                    model_id=model_id,
                    current_step=sum(train_history['steps'])
                )

            if params_train['scheduler'] is not None and len(agent.memory) >= params_train['batch_size']:
                scheduler.step()

        model_id = _get_model_id(agent)
        if params_train['checkpoint']['save_on_exit']:
            agent.save(
                checkpoints_dir_path=checkpoints_dir_path,
                model_id=model_id,
                current_step=sum(train_history['steps'])
            )

        return pd.DataFrame.from_dict(data=train_history), pd.DataFrame(evaluations, columns=eval_columns, index=evaluations_idcs), \
            running_loss, model_id

    except KeyboardInterrupt:
        model_id = _get_model_id(agent)
        if params_train['checkpoint']['save_on_exit']:
            agent.save(
                checkpoints_dir_path=checkpoints_dir_path,
                model_id=model_id,
                current_step=sum(train_history['steps'])
            )

        return pd.DataFrame.from_dict(data=train_history), pd.DataFrame(evaluations, columns=eval_columns, index=evaluations_idcs), \
            running_loss, model_id


def export_onnx(policy: nn.Module, policies_dir_path: str, model_id: str, device: torch.device) -> None:
    """
    Exports a policy into ONNX format to `policies_dir_path`.

    Args:
        - `policy`: model to be exported
        - `policies_dir_path`: path to the policies directory
        - `model_id`: id of the model
    """
    policy.eval()
    dummy_input = torch.zeros([1, 2, 6, 7], dtype=torch.float, device=device)
    Path(policies_dir_path).mkdir(
        parents=True,
        exist_ok=True
    )
    file_path = join(policies_dir_path, f'{model_id}.onnx')
    torch.onnx.export(
        model=policy,
        args=dummy_input,
        f=file_path,
        export_params=True,
        opset_version=10,
        do_constant_folding=True
    )
    print(f"Model in ONNX format saved to {file_path}")


def plot(train_history: pd.DataFrame, eval_history: pd.DataFrame, running_loss: list, model_id: str, figures_dir_path: str | None = None) -> None:
    """
    Plots training and evaluation metrics.

    Args:
        - `train_history`: Pandas dataframe with the history of the training.
        - `eval_history`: Pandas dataframe with the history of the evaluations.
        - `running_loss`: list with all the running losses.
        - `model_id`: id of the model.
        - `figures_dir_path`: path to the figures directory.
    """
    num_episodes = train_history.shape[0]
    _, ((ax1, ax2), (ax3, ax4), (ax5, ax6)) = plt.subplots(
        3, 2, sharey=False, figsize=(20, 10), layout='tight')
    running_loss_min = min(running_loss)
    running_loss_max = max(running_loss)

    ax1.set(title="Evaluation rewards", xlabel="Episode", ylabel="Reward",
            xlim=((0, num_episodes)))
    eval_history[['rewards_median']].plot(
        ax=ax1, linestyle='solid', c='#669944')
    eval_history[['rewards_mean']].plot(
        ax=ax1, linestyle='solid', c='#003060')
    ax1.fill_between(
        eval_history.index,
        (eval_history[['rewards_mean']].to_numpy() -
         eval_history[['rewards_std']].to_numpy()).flatten(),
        (eval_history[['rewards_mean']].to_numpy() +
         eval_history[['rewards_std']].to_numpy()).flatten(),
        alpha=0.1,
        color='#003060',
        linestyle='dashed'
    )
    ax1.legend(('Mean', 'Median', 'Standard deviation'),
               loc="lower center")

    ax2.set(title="Evaluation steps", xlabel="Episode", ylabel="Step",
            xlim=((0, num_episodes)))
    eval_history[['steps_median']].plot(
        ax=ax2, linestyle='solid', c='#669944')
    eval_history[['steps_mean']].plot(
        ax=ax2, linestyle='solid', c='#003060')
    ax2.fill_between(
        eval_history.index,
        (eval_history[['steps_mean']].to_numpy(
        )-eval_history[['steps_std']].to_numpy()).flatten(),
        (eval_history[['steps_mean']].to_numpy(
        )+eval_history[['steps_std']].to_numpy()).flatten(),
        alpha=0.1,
        color='#003060',
        linestyle='dashed'
    )
    ax2.legend(('Mean', 'Median', 'Standard deviation'),
               loc="lower center")

    ax3.set(title="Evaluation rates", xlabel="Episode", ylabel="Percentage",
            ylim=((0, 100)), xlim=((0, num_episodes)))
    eval_history['win_rate'].map(
        lambda x: x*100).plot(ax=ax3, c='#003060')
    eval_history['loss_rate'].map(
        lambda x: x*100).plot(ax=ax3, c='#c0304b')
    eval_history['draw_rate'].map(
        lambda x: x*100).plot(ax=ax3, c='#669944')
    ax3.legend(('Win', 'Loss', 'Draw'),
               loc="lower center")

    ax4_y_lower_bound = running_loss_min - \
        (0.1*(running_loss_max - running_loss_min))
    ax4_y_upper_bound = running_loss_max + \
        (0.1*(running_loss_max - running_loss_min))
    ax4.set(
        title="Running loss",
        xlabel="Step",
        ylabel="Loss",
        ylim=(ax4_y_lower_bound, ax4_y_upper_bound),
        xlim=(0, len(running_loss))
    )
    ax4.plot(
        running_loss,
        c='#003060')

    ax5.set(
        title="Training rewards",
        xlabel="Episode",
        ylabel="Reward",
        xlim=((0, num_episodes))
    )
    ax5.plot(
        train_history['rewards'],
        c='#003060'
    )
    ax5.plot(
        moving_average(train_history['rewards'].to_numpy()[
                       :num_episodes+1], 50),
        c='#47a2ff'
    )
    ax5.legend(
        ('Running', 'Average'),
        loc="lower center"
    )

    ax6.set(
        title="Training steps",
        xlabel="Episode",
        ylabel="Step",
        xlim=((0, num_episodes))
    )
    ax6.plot(
        train_history['steps'], c='#003060')
    ax6.plot(moving_average(train_history['steps'].to_numpy()[
        :num_episodes+1], 50), c='#47a2ff')
    ax6.legend(('Running', 'Average'), loc="upper center")

    if figures_dir_path is not None:
        Path(figures_dir_path).mkdir(
            parents=True,
            exist_ok=True
        )
        figure_path = join(figures_dir_path, f'{model_id}.png')
        plt.savefig(fname=figure_path)
        print(f"Model training and evaluation figure saved to {figure_path}")

    plt.show()


def _get_model_id(agent: DQNAgent) -> str:
    """
    Get the id of the model.

    Args:
        - `agent`: agent of type `DQNAgent`.

    Returns:
        - The id of the model.
    """
    return f"{agent.net.__class__.__name__}_{datetime.datetime.now().strftime('%Y_%m_%d_T_%H_%M_%S')}"


def _play_episode(agent: DQNAgent, env: ConnectFourEnv, total_steps: int, enforce_valid_action: bool) -> List[Transition]:
    """
    Plays an entire episode and return a list with all the transitions unaltered.

    Args:
        - `agent`: agent of type `DQNAgent`.
        - `env`: environment of type `ConnectFourEnv`.
        - `total_steps`: total number of steps taken during the training so far.
        - `enforce_valid_action`: whether to enforce that the action is valid or not.

    Returns:
        - A list with all the transitions unaltered.
    """
    agent.net.policy.train()
    transitions: List[Transition] = []
    # Initialize the environment and get its state
    state = env.reset()
    while True:
        num_steps = total_steps + len(transitions)

        valid_actions = env.get_valid_actions()

        action = agent.act(
            state=state,
            valid_actions=valid_actions,
            num_steps=num_steps,
            enforce_valid_action=enforce_valid_action
        )

        if action not in valid_actions:
            reward = env.params['rewards']['loss']
            transition = Transition(
                state=state,
                action=action,
                next_state=None,
                reward=reward)
            transitions.append(transition)
            break

        next_state, reward, is_done = env.step(action)
        transition = Transition(
            state=state,
            action=action,
            next_state=next_state,
            reward=reward
        )
        transitions.append(transition)

        if is_done:
            break

        state = next_state

        env.switch_turn()

    return transitions


def _evaluate(agent: DQNAgent, env: ConnectFourEnv, params: ParamsEval, device: torch.device) -> list:
    """
    Evaluates policy in `agent` agains a random agent in both turns, i.e. both strategies.

    Args:
        - `agent`: agent of type `DQNAgent`.
        - `env`: environment of type `ConnectFourEnv`.
        - `params`: object of type `ParamsEval` with the evaluation parameters.
        - `device`: torch device.

    Returns:
        - A list with the evaluation metrics.
    """
    agent.net.policy.eval()
    episodes_rewards = []
    episodes_steps = []
    rates = np.zeros([params['episodes']], dtype=np.int8)
    for episode in range(0, params['episodes']):
        player = np.random.choice([1, 2])
        state = env.reset()
        episode_rewards = 0.
        episode_steps = 0
        while True:
            valid_actions = env.get_valid_actions()
            if player == env.turn:
                action = agent.exploit(
                    state, valid_actions, params['enforce_valid_action'])
                if not params['enforce_valid_action'] and action not in valid_actions:
                    episode_rewards += env.params['rewards']['loss']
                    episodes_rewards.append(episode_rewards)
                    episodes_steps.append(episode_steps)
                    rates[episode] = -1
                    break

            else:
                action = np.random.choice(valid_actions)

            next_state, reward, is_done = env.step(action)
            episode_steps += 1
            if is_done:
                if env.winner == player:
                    episode_rewards += reward

                episodes_rewards.append(episode_rewards)
                episodes_steps.append(episode_steps)
                rates[episode] = 0 if env.winner is None else 1 if env.winner == player else -1
                break

            if env.turn == player:
                episode_rewards += reward

            state = next_state
            env.switch_turn()

    values, counts = np.unique(rates, return_counts=True)
    value_counts = dict(zip(values, counts))
    win_rate = value_counts[1] / \
        len(rates) if 1 in value_counts else 0
    draw_rate = value_counts[0] / len(rates) if 0 in value_counts else 0
    loss_rate = 1 - win_rate - draw_rate

    finish_boards, finish_solutions, block_boards,  block_solutions = [], [], [], []
    for finish_board_solution, block_board_solution in zip(finishes_boards_solutions, blocks_boards_solutions):
        finish_boards.append(finish_board_solution[0])
        finish_solutions.append(finish_board_solution[1])
        block_boards.append(block_board_solution[0])
        block_solutions.append(block_board_solution[1])

    finish_actions = get_actions(
        policy=agent.net.policy,
        observations=finish_boards,
        device=device
    )
    block_actions = get_actions(
        policy=agent.net.policy,
        observations=block_boards,
        device=device
    )

    finish_perc = sum([finish_solutions[i] == action for i,
                       action in enumerate(finish_actions)])/len(finish_boards) * 100
    block_perc = sum([block_solutions[i] == action for i,
                     action in enumerate(block_actions)])/len(block_boards) * 100

    evaluation = [np.median(episodes_rewards), np.mean(episodes_rewards), np.std(episodes_rewards), np.median(
        episodes_steps),  np.mean(episodes_steps), np.std(episodes_steps),
        win_rate, loss_rate, draw_rate, finish_perc, block_perc]
    agent.net.policy.train()
    return evaluation


def _optimize(agent: DQNAgent, running_loss: list, episode: int) -> None:
    """
    Optimizes the policy in `agent`, updates the target in `agent` and appends the loss 
    to `running_loss`.

    Args:
        - `agent`: agent of type `DQNAgent`.
        - `running_loss`: list with the running losses.
        - `episode`: current episode of the training.
    """
    loss = agent.optimize()
    running_loss.append(loss)

    agent.update_target(episode)


def _print_metrics(agent: DQNAgent, evaluation: list, train_history: dict[str, list], params_eval: ParamsEval, running_loss: list, episode: int) -> None:
    """
    Prints evaluation and training metrics.

    Args:
        - `agent`: agent of type `DQNAgent`.
        - `evaluation`: list with the evaluation metrics.
        - `train_history`: dictionary with the training metrics.
        - `params_eval`: `ParamsEval` object with the parameters of the evaluations.
        - `running_loss`: list with the running losses.
        - `episode`: current episode of the training.
    """
    minutes, seconds = divmod(
        train_history['time'][episode-1], 60)
    duration = f'{int(minutes)}m {round(seconds, 2)}s' if minutes > 0 else f'{round(seconds, 2)}s'
    running_loss_window = len(running_loss) if len(
        running_loss) < params_eval['period'] else params_eval['period']
    train_history_window = len(train_history['rewards']) if len(
        train_history['rewards']) < params_eval['period'] else params_eval['period']
    train_rewards_str = f"{round(train_history['rewards'][-1], 4)} ({round(moving_average(train_history['rewards'], train_history_window)[-1], 4)})"
    train_steps_str = f"{round(train_history['steps'][-1], 4)} ({round(moving_average(train_history['steps'], train_history_window)[-1], 4)})"
    running_loss_str = f"{round(running_loss[-1], 4)} ({round(moving_average(running_loss, running_loss_window)[-1], 4)})"
    eval_reward = f"{np.round(evaluation[1], 4)}  {np.round(evaluation[2], 4)}"

    print(
        f"{episode:^10}{sum(train_history['steps']):^10}{train_rewards_str:^20}{train_steps_str:^14}{running_loss_str:^20}{eval_reward:^25}"
        f"{round(evaluation[6]*100, 2):^10}{str(round(agent.eps_threshold, 4)):^10}{str(round(agent.optimizer.param_groups[0]['lr'], 8)):^6}{duration:^11}"
    )
