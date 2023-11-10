import type { Network } from './types/connect-four';

/**
 * Check if an object is an instance of the entity `Network`.
 * @param network - network name to check.
 * @returns Boolean that represents whether the object is an instance of `Network`.
 */
export function isInstanceOfNetwork(network: unknown): network is Network {
  return (
    typeof network === 'string' &&
    (network === 'sepolia' || network === 'localhost')
  );
}
