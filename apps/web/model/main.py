#!/usr/bin/env python

import numpy as np
import random
import torch
from agent import DQNAgent
from constants import CHECKPOINTS_DIR_PATH, FIGURES_DIR_PATH, POLICIES_DIR_PATH
from custom_types import ParamsAgent, ParamsEnv, ParamsEval, ParamsTrain
from env import ConnectFourEnv
from training import train, plot, export_onnx
from modules import ConnectFourNet

SEED = 29
random.seed(SEED)
torch.manual_seed(SEED)
np.random.seed(SEED)

device = torch.device(
    'mps' if torch.backends.mps.is_built() else 'cuda' if torch.cuda.is_available() else 'cpu')


def main():
    # parameters
    params_env: ParamsEnv = {
        'action_space': 7,
        'observation_space': 6,
        'rewards': {
            'win': 1.,
            'loss': -1.,
            'draw': 0,
            'prolongation': -0.
        }
    }

    params_eval: ParamsEval = {
        'enforce_valid_action': False,
        'episodes': 100,
        'period': 25
    }

    params_train: ParamsTrain = {
        'batch_size': 512,
        'checkpoint': {
            'save_every':  20000,
            'save_on_exit': True
        },
        'display_period': 1000,
        'enforce_valid_action': False,
        'episodes': 50000,
        'scheduler': {
            'name': 'MultiStepLR',
            'config': {
                'milestones': [40000],
                'gamma': 0.2
            }
        }
    }

    params_agent: ParamsAgent = {
        'batch_size': params_train['batch_size'],
        'clip_grads': None,
        #  'clip_grads': {'name': 'clip_grad_norm_',
        #                 'config': {'max_norm': 1.0,
        #                            'norm_type': 2}},
        'criterion': {
            'name': 'HuberLoss',
            'config': {}
        },
        'double': True,
        'epsilon': {
            'start': 0.9,
            'end': 0.05,
            # the higher the more exploration
            # avg num_steps / factor
            'decay': params_train['episodes'] * 25 / 7.5
        },
        'gamma': 0.99,
        'memory__maxlen': params_train['episodes'] * 25,
        'optimizer': {
            'name': 'SGD',
            'config': {
                'lr': 1e-2,
                'momentum': 0.9,
                # 'weight_decay': 0.001
            }
        },
        'target_update': {
            'mode': 'soft',
            'config': {
                'tau': 0.005
            }
        },
        # 'target_update': {
        #     'mode': 'hard',
        #     'config': {
        #         'period': 100
        #     }
        # },
        'out_features': params_env['action_space']
    }

    # nets
    net = ConnectFourNet(out_features=params_env['action_space']).to(device)

    # agent
    load_model_path = None
    # load_model_path = join(EXPORTS_DIR_PATH, 'checkpoints', 'ConnectFourNet_2023-10-10T07:52:28.chkpt')
    agent = DQNAgent(
        net=net,
        params=params_agent,
        device=device,
        load_model_path=load_model_path
    )

    # environment
    env = ConnectFourEnv(
        params=params_env,
        device=device
    )

    # train
    args = train(
        agent=agent,
        env=env,
        params_train=params_train,
        params_eval=params_eval,
        checkpoints_dir_path=CHECKPOINTS_DIR_PATH,
        device=device
    )

    # export onnx
    _, _, _, model_id = args
    export_onnx(
        policy=agent.net.policy,
        policies_dir_path=POLICIES_DIR_PATH,
        model_id=model_id,
        device=device
    )

    # plot training results
    plot(
        *args,
        figures_dir_path=FIGURES_DIR_PATH,
    )


if __name__ == '__main__':
    main()
