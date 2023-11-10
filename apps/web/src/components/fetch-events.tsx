import { useState, useEffect, useRef } from 'react';
import { type Address } from 'wagmi';
import { type WriteContractResult } from 'wagmi/actions';
import { type Toast, useToast, Modal } from 'ui';
import modalStyles from '../styles/modules/modal.module.css';
import { useEvents } from '../hooks';

interface ModalProps {
  abi: any;
  address: Address;
  blockNumber: bigint;
  isWriteContractResultSuccess: boolean;
  resetWriteContractResult: () => void;
  writeContractResult: WriteContractResult | undefined;
}

export function FetchEvents({
  abi,
  address,
  blockNumber,
  isWriteContractResultSuccess,
  resetWriteContractResult,
  writeContractResult
}: ModalProps): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [result, setResult] = useState<boolean | null | undefined>(null);
  const [isLoadingResult, setIsLoadingResult] = useState<boolean>(false);
  const [isErrorResult, setIsErrorResult] = useState<boolean>(false);
  const timerId = useRef<null | NodeJS.Timeout>(null); // eslint-disable-line -- allow undef

  const { events } = useEvents({
    address,
    abi,
    eventName: 'ProofVerification',
    fromBlock: blockNumber,
    shouldStopPolling: typeof result === 'boolean' || isErrorResult,
    pollInterval: 5000
  });

  useEffect(() => {
    if (
      isWriteContractResultSuccess &&
      typeof writeContractResult !== 'undefined'
    ) {
      setIsLoadingResult(true);
    }
  }, [isWriteContractResultSuccess, writeContractResult]);

  useEffect(() => {
    if (
      isWriteContractResultSuccess &&
      typeof writeContractResult !== 'undefined' &&
      events !== null
    ) {
      for (const event of events) {
        if (event.transactionHash === writeContractResult.hash) {
          const event_ = event as unknown as { args: { result: boolean } };
          setResult(event_.args.result);
          setIsLoadingResult(false);
          setIsModalOpen(true);
        }
      }
    }
  }, [writeContractResult, events, result, isWriteContractResultSuccess]);

  useEffect(() => {
    timerId.current = setTimeout(() => {
      if (result === null) {
        setIsErrorResult(true);
        setIsModalOpen(true);
      }
    }, 30000);

    return () => {
      if (timerId.current !== null) {
        clearTimeout(timerId.current);
      }
    };
  }, [result]);

  const toast: Toast = {
    isLoading: isLoadingResult,
    isError: isErrorResult,
    isSuccess: typeof result === 'boolean',
    loadingText:
      'Retrieving event emitted by the PLONK verifier smart contract...',
    successText: 'The event has been succesfully retrieved.',
    errorText: 'The event could not be retrieved.'
  };
  useToast(toast);

  function handleClose(): void {
    setResult(null);
    resetWriteContractResult();
    setIsModalOpen(false);
  }

  return (
    <Modal
      className={modalStyles.modal}
      handler={handleClose}
      isOpen={isModalOpen}
      overlayClassName="overlay"
    >
      {isErrorResult ? (
        <p>
          The transaction has been made, however, there has been a problem
          retrieving the event emitted by the verifier.
        </p>
      ) : (
        <>
          <p>The proof has been verified successfully.</p>
          <p>
            A PLONK verifier has attested to the{' '}
            <b>{result ? 'validity' : 'invalidity'}</b> of the zk-SNARK proof.
          </p>
        </>
      )}
    </Modal>
  );
}
