import { useState, useEffect, useRef } from 'react';
import { type Address } from 'wagmi';
import { useToast, Modal } from 'ui';
import modalStyles from '../styles/modules/modal.module.css';
import { useEvent } from '../hooks/use-event';
import {
  connectFourSelector,
  resetVerification,
  setVerificationStatus,
  setVerifiedResult
} from '../state';
import { useAppDispatch, useAppSelector } from '../hooks';

interface ModalProps {
  abi: any;
  address: Address;
}

export function FetchEvent({ abi, address }: ModalProps): JSX.Element {
  const dispatch = useAppDispatch();
  const {
    verification: { status, txHash, blockNumber, isValid }
  } = useAppSelector(connectFourSelector);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const timerId = useRef<null | NodeJS.Timeout>(null); // eslint-disable-line -- allow undef
  const { event } = useEvent({
    address,
    abi,
    txHash,
    eventName: 'ProofVerification',
    fromBlock: blockNumber ? BigInt(blockNumber) : 'safe',
    toBlock: blockNumber ? BigInt(blockNumber) : 'latest',
    shouldStopPolling: status === 'VERIFIED' || status === 'ERROR',
    pollInterval: 5000
  });

  useEffect(() => {
    if (status === 'TX_SUCCESS') {
      dispatch(setVerificationStatus('FETCHING_EVENT'));
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (status === 'FETCHING_EVENT' && event !== null) {
      const {
        args: { success }
      } = event as unknown as { args: { success: boolean } };
      dispatch(setVerifiedResult(success));
      setIsModalOpen(true);
    }
  }, [dispatch, event, status]);

  useEffect(() => {
    if (status === 'FETCHING_EVENT') {
      timerId.current = setTimeout(() => {
        dispatch(setVerificationStatus('ERROR'));
        setIsModalOpen(true);
      }, 30000);
    }
    return () => {
      if (timerId.current !== null) {
        clearTimeout(timerId.current);
      }
    };
  }, [dispatch, status]);

  useToast({
    isLoading: status === 'FETCHING_EVENT',
    isError: status === 'ERROR' && isModalOpen,
    isSuccess: status === 'VERIFIED',
    loadingText:
      'Retrieving event emitted by the PLONK verifier smart contract...',
    successText: 'The event has been succesfully retrieved.',
    errorText: 'The event could not be retrieved.'
  });

  function handleClose(): void {
    setIsModalOpen(false);
    dispatch(resetVerification());
  }

  return (
    <Modal
      className={modalStyles.modal}
      handler={handleClose}
      isOpen={isModalOpen}
      overlayClassName={modalStyles.overlay}
    >
      {status === 'ERROR' ? (
        <p>
          The transaction was successful, but the verification result could not
          be retrieved.
        </p>
      ) : (
        <>
          <p>The proof has been verified successfully.</p>
          <p>
            A PLONK verifier has attested to the{' '}
            <b>{isValid ? 'validity' : 'invalidity'}</b> of the zk-SNARK proof.
          </p>
        </>
      )}
    </Modal>
  );
}
