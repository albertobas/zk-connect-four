import { useNetwork } from 'wagmi';
import { useIsMounted } from 'ui';
import { useAppSelector } from '../hooks';
import { connectFourSelector } from '../state';
import { isInstanceOfSupportedChainId } from '../helpers';
import { EnabledVerifyButton } from './enabled-verify-button';
import { DisabledVerifyButton } from './disabled-verify-button';

export function VerifyButton(): JSX.Element {
  const { winner, status } = useAppSelector(connectFourSelector);
  const isMounted = useIsMounted();
  const { chain } = useNetwork();

  if (!isMounted) {
    return <DisabledVerifyButton title="Mounting" />;
  }

  if (status !== 'GAME_OVER' && winner === null) {
    return (
      <DisabledVerifyButton title="The game has to be over in order to verify a proof " />
    );
  }

  if (winner === null) {
    return (
      <DisabledVerifyButton title="There needs to be a winner of the game in order to verify a proof" />
    );
  }

  if (status !== 'GAME_OVER') {
    return (
      <DisabledVerifyButton title="There needs to be a winner of the game in order to verify a proof" />
    );
  }

  if (typeof chain === 'undefined') {
    return (
      <DisabledVerifyButton title="You need to connect to a supported network in Metamask" />
    );
  }

  if (!isInstanceOfSupportedChainId(chain.id)) {
    return (
      <DisabledVerifyButton title="You need to connect to a supported network first" />
    );
  }

  return <EnabledVerifyButton chainId={chain.id} winner={winner} />;
}
