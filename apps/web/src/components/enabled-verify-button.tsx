import { useContractWrite, type Address, useBlockNumber } from 'wagmi';
import { Button, useToast, type Toast } from 'ui';
import { useAppSelector } from '../hooks';
import { connectFourSelector } from '../state';
import { generateProof } from '../utils';
import type { ConnectFourWinner, Network } from '../types/connect-four';
import { FetchEvents } from './fetch-events';

interface VerifyProps {
  abi: any;
  address: Address;
  chainId: number;
  networkName: Network;
  winner: ConnectFourWinner;
}

export function EnabledVerifyButton({
  abi,
  address,
  chainId,
  winner
}: VerifyProps): JSX.Element {
  const { board } = useAppSelector(connectFourSelector);
  const { write, data, isLoading, isError, isSuccess, reset } =
    useContractWrite({
      abi,
      address,
      functionName: 'verifyProof',
      chainId
    });
  const { data: blockNumber, isLoading: isBlockLoading } = useBlockNumber();

  const toast: Toast = {
    isLoading,
    isError,
    isSuccess,
    loadingText: 'Waiting for the transaction to be made...',
    errorText: 'The transaction has failed.',
    successText: 'The transaction has been made succesfully.'
  };
  useToast(toast);

  async function handleVerify(e: React.MouseEvent): Promise<void> {
    e.preventDefault();
    try {
      // generate public signals and zkSNARK proof
      const { proof, publicSignals } = await generateProof(board, winner);
      // make transaction to the PLONK verifier and verify the proof
      write({ args: [proof, publicSignals] });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Button
        onClick={handleVerify} // eslint-disable-line -- allow promise-returning function
        title="Generate a zk-SNARK and get a PLONK verifier to attest to its validity"
        type="button"
      >
        Verify
      </Button>
      {isSuccess && !isBlockLoading ? (
        <FetchEvents
          abi={abi}
          address={address}
          blockNumber={blockNumber ?? BigInt('0n')}
          isWriteContractResultSuccess={isSuccess}
          resetWriteContractResult={reset}
          writeContractResult={data}
        />
      ) : null}
    </>
  );
}
