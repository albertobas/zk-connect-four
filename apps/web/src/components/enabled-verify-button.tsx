import { Button, useToast } from 'ui';
import {
  prepareWriteContract,
  writeContract,
  waitForTransaction
} from 'wagmi/actions';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  connectFourSelector,
  setTransactionData,
  setVerificationStatus
} from '../state';
import { generateProof } from '../utils';
import type { ConnectFourWinner } from '../types/connect-four';
import { CONTRACTS, type SupportedChainId } from '../constants/contracts';
import { FetchEvent } from './fetch-event';

interface VerifyProps {
  chainId: number;
  winner: ConnectFourWinner;
}

const GAS_LIMIT = 1_000_000n;

export function EnabledVerifyButton({
  chainId,
  winner
}: VerifyProps): JSX.Element {
  const dispatch = useAppDispatch();
  const { abi, address } = CONTRACTS[chainId as SupportedChainId];

  const {
    board,
    lastMove,
    verification: { status, txHash }
  } = useAppSelector(connectFourSelector);

  useToast({
    isLoading: status === 'GENERATING_PROOF' || status === 'WAITING_FOR_TX',
    isError: status === 'ERROR',
    isSuccess: status === 'TX_SUCCESS',
    loadingText: 'Waiting for the transaction to be made...',
    errorText: 'The transaction has failed.',
    successText: 'The transaction has been made succesfully.'
  });

  async function handleVerify(e: React.MouseEvent): Promise<void> {
    e.preventDefault();
    dispatch(setVerificationStatus('GENERATING_PROOF'));
    try {
      if (lastMove === null)
        throw new Error('There has been a problem setting the state.');
      // 1. generate public signals and zk-SNARK proof
      const { proofBytes, pubSignals } = await generateProof(
        board,
        winner,
        lastMove
      );
      dispatch(setVerificationStatus('WAITING_FOR_TX'));
      // 2. prepare the contract call
      const { request } = await prepareWriteContract({
        abi,
        address,
        args: [proofBytes, pubSignals],
        functionName: 'verifyProof',
        chainId
      });
      const finalGas = request.gas ? (request.gas * 130n) / 100n : GAS_LIMIT;
      // 3 - make transaction to the PLONK verifier to verify the proof
      const { hash } = await writeContract({ ...request, gas: finalGas });
      // 4 - wait for transaction
      const res = await waitForTransaction({ hash });
      if (res.status === 'success') {
        dispatch(
          setTransactionData({ blockNumber: res.blockNumber.toString(), hash })
        );
        dispatch(setVerificationStatus('TX_SUCCESS'));
      } else {
        dispatch(setVerificationStatus('ERROR'));
      }
    } catch (error) {
      dispatch(setVerificationStatus('ERROR'));
      console.error(error);
    }
  }

  return (
    <>
      <Button
        disabled={status !== 'IDLE' && status !== 'ERROR'}
        onClick={handleVerify} // eslint-disable-line -- allow promise-returning function
        title="Generate a zk-SNARK and get a PLONK verifier to attest to its validity"
        type="button"
      >
        Verify
      </Button>
      {txHash ? <FetchEvent abi={abi} address={address} /> : null}
    </>
  );
}
