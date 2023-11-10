import { useNetwork, type Address } from 'wagmi';
import { sepolia, localhost } from 'wagmi/chains';
import { useEffect, useState } from 'react';
import type { Abi } from 'viem';
import { useIsMounted } from 'ui';
import { useAppSelector } from '../hooks';
import { connectFourSelector } from '../state';
import { isInstanceOfNetwork } from '../helpers';
import { EnabledVerifyButton } from './enabled-verify-button';
import { DisabledVerifyButton } from './disabled-verify-button';

export function VerifyButton(): JSX.Element {
  const { winner, status } = useAppSelector(connectFourSelector);
  const isMounted = useIsMounted();
  const [contractData, setContractData] = useState<{
    abi: Abi;
    address: Address;
  } | null>(null);
  const { chain } = useNetwork();

  const networkName = process.env.NEXT_PUBLIC_NETWORK_NAME;

  if (!isInstanceOfNetwork(networkName)) {
    throw new Error(
      'Either the network is not defined or it is different to Sepolia or Localhost'
    );
  }

  useEffect(() => {
    async function getJSON(): Promise<void> {
      if (networkName === 'localhost') {
        const json = await import('../generated/localhost.json');
        const { abi, address } = json.contracts.ZKConnectFour;
        setContractData({ abi: abi as Abi, address: address as Address });
      } else {
        const json = await import('../generated/sepolia.json');
        const { abi, address } = json.contracts.ZKConnectFour;
        setContractData({ abi: abi as Abi, address: address as Address });
      }
    }
    getJSON(); // eslint-disable-line -- allow floating promise
  }, [networkName]);

  if (!isMounted) {
    return <DisabledVerifyButton title="Mounting" />;
  }

  if (status !== 'gameOver' && winner === null) {
    return (
      <DisabledVerifyButton title="The game has to be over in order to verify a proof " />
    );
  }

  if (winner === null) {
    return (
      <DisabledVerifyButton title="There needs to be a winner of the game in order to verify a proof" />
    );
  }

  if (status !== 'gameOver') {
    return (
      <DisabledVerifyButton title="There needs to be a winner of the game in order to verify a proof" />
    );
  }

  if (typeof chain === 'undefined') {
    return (
      <DisabledVerifyButton title="You need to connect to a supported network in Metamask" />
    );
  }

  if (networkName === 'sepolia' && chain.id !== sepolia.id) {
    return (
      <DisabledVerifyButton title="You need to connect to Sepolia first" />
    );
  }

  if (networkName === 'localhost' && chain.id !== localhost.id) {
    return (
      <DisabledVerifyButton title="You need to connect to Localhost first" />
    );
  }

  if (contractData === null) {
    return (
      <DisabledVerifyButton title="Contract's ABI and address could not be loaded" />
    );
  }

  const { abi, address } = contractData;

  return (
    <EnabledVerifyButton
      abi={abi}
      address={address}
      chainId={chain.id}
      winner={winner}
    />
  );
}
