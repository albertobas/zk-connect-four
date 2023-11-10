import { useEffect } from 'react';
import { connectFourSelector, setStatus, setWinner } from '../state';
import { checkWinner } from '../utils';
import { type ConnectFourStatus } from '../types/connect-four';
import { useAppDispatch } from './use-app-dispatch';
import { useAppSelector } from './use-app-selector';

/**
 * Hook to update the Connect Four state when playing User vs User.
 * This hook will:
 * - update the board whenever state coordinates change, and switch the turn.
 * - check if there is a winner and change the status of the game accordingly.
 * - check if there is a tie and change the status of the game accordingly.
 */
export function useGameOver(): void {
  const { status, board, numCounters, winner, mode } =
    useAppSelector(connectFourSelector);
  const dispatch = useAppDispatch();

  // check for a winner
  useEffect(() => {
    if (status !== 'gameOver') {
      const winner_ = checkWinner(board);
      if (winner_ !== null) {
        const newStatus: ConnectFourStatus = 'gameOver';
        dispatch(setWinner(winner_));
        dispatch(setStatus(newStatus));
      }
    }
  }, [status, board, dispatch, mode]);

  // check for a draw
  useEffect(() => {
    if (numCounters === 42 && winner === null) {
      const newStatus: ConnectFourStatus = 'gameOver';
      dispatch(setStatus(newStatus));
    }
  }, [numCounters, dispatch, mode, status, winner]);
}
