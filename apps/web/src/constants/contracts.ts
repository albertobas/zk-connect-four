import { localhost, sepolia } from 'viem/chains';
import type { Abi, Address } from 'viem';
import jsonSepolia from '../generated/sepolia.json';

let jsonLocalhost = null;

if (process.env.NODE_ENV === 'development') {
  try {
    // if this throws 'Module not found' is because the contracts have not
    // been deployed locally and exported
    jsonLocalhost = require('../generated/localhost.json');
  } catch (e) {
    //
  }
}

export const CONTRACTS = {
  [sepolia.id]: {
    address: jsonSepolia.contracts.ZKConnectFour.address as Address,
    abi: jsonSepolia.contracts.ZKConnectFour.abi as Abi
  },
  ...(jsonLocalhost && {
    [localhost.id]: {
      address: jsonLocalhost.contracts.ZKConnectFour.address as Address,
      abi: jsonLocalhost.contracts.ZKConnectFour.abi as Abi
    }
  })
} as const;

export type SupportedChainId = keyof typeof CONTRACTS;
