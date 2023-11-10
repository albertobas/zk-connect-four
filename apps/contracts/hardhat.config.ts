import { type HardhatUserConfig } from 'hardhat/types';
import '@typechain/hardhat';
import '@nomicfoundation/hardhat-ethers';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';

const { PROJECT_ID, PRIVATE_KEY } = process.env;

if (typeof PRIVATE_KEY === 'undefined') {
  throw new Error('Please set your PRIVATE_KEY in a .env file');
}

if (typeof PROJECT_ID === 'undefined') {
  throw new Error('Please set your PROJECT_ID in a .env file');
}

const config: HardhatUserConfig = {
  namedAccounts: {
    deployer: 0
  },
  networks: {
    hardhat: {
      chainId: 1337 // https://hardhat.org/metamask-issue.html
    },
    localhost: {
      chainId: 1337,
      url: 'http://127.0.0.1:8545'
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${PROJECT_ID}`,
      accounts: [PRIVATE_KEY]
    }
  },
  paths: { sources: './src' },
  typechain: {
    outDir: './types',
    target: 'ethers-v6'
  },
  solidity: '0.8.17'
};

export default config;
