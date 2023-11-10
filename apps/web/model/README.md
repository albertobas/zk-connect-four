# Training a DQN agent to play Connect Four

[![GNU General Public License v3.0](https://img.shields.io/badge/License-GNU_General_Public_License_v3.0-yellow.svg)](https://github.com/albertobas/zk-connect-four/blob/main/LICENSE)

## About

Reinforcement learning task to train a DQN agent to optimize a policy on both strategies of the Connect Four game.

It includes a Jupyter notebook, which explains this excersice, in English and another one in Spanish.

## Running locally

Before running this code you will need to have poetry installed in your computer.

```bash
$ git clone https://github.com/albertobas/zk-connect-four.git
$ cd zk-connect-four/apps/web/model
$ poetry install --no-root
$ poetry run python main.py
```

## Linting the code

```bash
$ poetry run mypy *.py --check-untyped-defs
```

## Related posts

I have written the following posts to explain in detail this project:

- [Training a DQN agent to play Connect Four](https://www.albertobas.com/blog/training-dqn-agent-to-play-connect-four 'Training a DQN agent to play Connect Four - Alberto Bas')
