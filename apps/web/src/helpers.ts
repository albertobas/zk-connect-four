import { CONTRACTS, type SupportedChainId } from './constants/contracts';

/**
 * Check if an object is an instance of the entity `SupportedChain`.
 * @param chainId - chainId number to check.
 * @returns Boolean that represents whether the object is an instance of `SupportedChain`.
 */
export function isInstanceOfSupportedChainId(
  chainId: unknown
): chainId is SupportedChainId {
  return (
    typeof chainId === 'number' && chainId in CONTRACTS
    // (chainId === sepolia.id || chainId === localhost.id)
  );
}
