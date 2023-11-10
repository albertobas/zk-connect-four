import { useNetwork } from 'wagmi';
import { sepolia, localhost } from 'wagmi/chains';
import { useIsMounted } from 'ui';
import { useAppSelector } from '../hooks';
import { connectFourSelector } from '../state';
import { isInstanceOfNetwork } from '../helpers';
import { EnabledVerifyButton } from './enabled-verify-button';
import { DisabledVerifyButton } from './disabled-verify-button';

export function VerifyButton(): JSX.Element {
  const { winner, status } = useAppSelector(connectFourSelector);
  const isMounted = useIsMounted();
  const { chain } = useNetwork();

  const networkName = process.env.NEXT_PUBLIC_NETWORK_NAME;

  if (!isInstanceOfNetwork(networkName)) {
    throw new Error(
      'Either the network is not defined or it is different to Sepolia or Localhost'
    );
  }

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

  return <EnabledVerifyButton chainId={chain.id} winner={winner} />;
}
