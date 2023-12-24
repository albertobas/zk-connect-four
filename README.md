# zk Connect Four

[![GNU General Public License v3.0](https://img.shields.io/badge/License-GNU_General_Public_License_v3.0-yellow.svg)](https://github.com/albertobas/zk-connect-four/blob/main/LICENSE)

![zk Connect Four demo](https://www.albertobas.com/images/blog/how-to-build-zero-knowledge-dapp/zk_connect_four.gif)

## About

zk Connect Four is a zero-knowledge decentralised application that lets you play the game of Connect Four against a DQN agent-trained policy or against another user, and generate and verify a zk-SNARK proof to validate that a user knows who won a valid game without revealing any information.

## Technical details

The bulk of this application is made up of (i) circuits authored in Circom and tested using TypeScript, (ii) smart contracts are written in Solidity using Hardhat and (iii) a React application written in TypeScript using Next.js.

The model that is used to play against a user is a policy optimized by a DQN agent in a reinforcement learning task using PyTorch.

- **Circuits language**: [Circom](https://docs.circom.io)
- **Contracts language**: [Solidity](https://soliditylang.org)
- **Contracts framework**: [Hardhat](https://hardhat.org)
- **Front-end framework**: [Next.js](https://nextjs.org)
- **Front-end language**: [TypeScript](https://www.typescriptlang.org)
- **Styling**: [PostCSS](https://postcss.org)
- **Python dependency manager**: [Poetry](https://python-poetry.org)
- **Machine learning framework**: [Pytorch](https://pytorch.org)

## Overview

- `packages/*`: npm packages that contain code and configuration files that are used by other packages or services.
- `apps/*`: workspaces that make up the bulk of the application.
- `apps/circuits/*`: circuits workspace, it includes circuits written in Circom and a circuit unit test.
- `apps/contracts/*`: smart contracts workspace which gathers contracts written in Solidity language, deploy scripts and a deployment json.
- `apps/web/*`: front-end workspace which includes React functional components, CSSModules files, PostCSS mixins and a global css file.

## Running locally

Before running this application you will need to have pnpm and Circom installed in your computer and download the proper powers of Tau file and paste it to apps/circuits/ptau (more info in [this readme file](/apps/circuits/ptau/README.md)).

```bash
$ git clone https://github.com/albertobas/zk-connect-four.git
$ cd zk-connect-four
$ cp .env.example .env # fill in tha values for each variable in ./.env, NEXT_PUBLIC_NETWORK_NAME must be either sepolia or localhost.
$ pnpm install
$ pnpm dev
```

If you'd like to run this application locally and deploy the contracts on a local node, replace `sepolia` for `localhost` in the `NEXT_PUBLIC_NETWORK_NAME` environment variable (and import the corresponding contract ABI and address in `apps/web/src/components/enabled-verify-button.tsx` after deploying the contracts locally and exporting the data) and run:

```bash
$ pnpm node
```

Then, open another tab in terminal and:

```bash
$ pnpm compile && pnpm generate && pnpm deploy:contracts && pnpm export
$ pnpm dev
```

## Testing the circuit

```bash
$ pnpm test
```

## Related posts

I have written the following posts to explain in detail this project:

- [How to build a zero-knowledge DApp](https://www.albertobas.com/blog/how-to-build-zero-knowledge-dapp 'How to build a zero-knowledge DApp | Alberto Bas')
- [Training a DQN agent to play Connect Four](https://www.albertobas.com/blog/training-dqn-agent-to-play-connect-four 'Training a DQN agent to play Connect Four | Alberto Bas')
