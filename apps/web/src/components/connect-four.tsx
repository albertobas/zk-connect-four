import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Button, Modal } from 'ui';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../hooks';
import { connectFourSelector, resetGame, setMode, setStatus } from '../state';
import { getResult } from '../utils';
import { dictMode } from '../constants/game';
import { type ConnectFourMode } from '../types/connect-four';
import modalStyles from '../styles/modules/modal.module.css';
import { VerifyButton } from './verify-button';
import { UserVsAIBoard } from './user-vs-ai-board';
import { UserVsUserBoard } from './user-vs-user-board';
import styles from './connect-four.module.css';

export function ConnectFour({ mode }: { mode: ConnectFourMode }): JSX.Element {
  const { numCounters, status, winner } = useAppSelector(connectFourSelector);
  const dispatch = useAppDispatch();
  const [isModalClosed, setIsModalClosed] = useState<boolean>(true);
  const { isConnected } = useAccount();

  useEffect(() => {
    if (status === 'GAME_OVER') {
      setIsModalClosed(false);
    }
  }, [status]);

  function handleGoBack(e: React.MouseEvent): void {
    e.preventDefault();
    dispatch(resetGame());
    dispatch(setMode(null));
    dispatch(setStatus('IDLE'));
    toast.dismiss();
  }

  function handleNewGame(e: React.MouseEvent): void {
    e.preventDefault();
    dispatch(resetGame());
    dispatch(setStatus('PLAYING'));
    toast.dismiss();
  }

  function renderBoard(): JSX.Element {
    if (mode === 'userVsAI') {
      return <UserVsAIBoard />;
    } else if (mode === 'aIVsUser') {
      return <UserVsAIBoard isAIFirst />;
    }
    return <UserVsUserBoard />;
  }

  const isDisabled = numCounters === 0;

  return (
    <>
      <p className={styles.mode}>
        <b>Mode:</b>
        <em>{` ${dictMode[mode]}`}</em>
      </p>
      {renderBoard()}
      <div className={styles.controlBtnsFlex}>
        <Button
          onClick={handleGoBack}
          title="Go back to select a different mode"
        >
          Go back
        </Button>
        <Button
          disabled={isDisabled}
          onClick={handleNewGame}
          title={
            isDisabled ? 'The game has not started yet' : 'Play a new game'
          }
        >
          New game
        </Button>
        <VerifyButton />
      </div>
      <Modal
        className={modalStyles.modal}
        isOpen={!isModalClosed}
        overlayClassName={modalStyles.overlay}
        setIsModalClosed={setIsModalClosed}
      >
        {getResult(status, winner, mode)}
        <p>
          {isConnected
            ? 'If you wish you can'
            : 'If you connected to your wallet account you could'}{' '}
          now generate a zk-SNARK proof and get a PLONK verifier to validate it
          by clicking on <b>Verify</b> once you{' '}
          {isConnected ? 'close' : 'closed'} this window.
        </p>
        <p>
          A PLONK verifier {isConnected ? 'will' : 'would'} then attest to the
          validity of the win without data being revealed.
        </p>
        <p>
          If you&apos;d like to use a different network, please select that
          network in your wallet first.
        </p>
      </Modal>
    </>
  );
}
