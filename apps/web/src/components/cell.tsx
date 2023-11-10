import { Button } from 'ui';
import { useAppDispatch, useAppSelector } from '../hooks';
import { connectFourSelector, switchTurn, setBoard } from '../state';
import type { ColorType } from '../types/connect-four';
import { checkWinner, validateMove, updateBoard, getRowIndex } from '../utils';
import styles from './cell.module.css';

interface CellProps {
  color: ColorType;
  colIndex: number;
  rowIndex: number;
  isWinner?: boolean;
}

export function Cell({
  color,
  colIndex,
  rowIndex,
  isWinner
}: CellProps): JSX.Element {
  const { board, turn, mode, status, numCounters } =
    useAppSelector(connectFourSelector);
  const dispatch = useAppDispatch();

  function handleClick(): void {
    const counterRowIndex = getRowIndex(board, colIndex);
    if (counterRowIndex !== null) {
      const isValid = validateMove(board, counterRowIndex, colIndex);
      if (isValid) {
        const updatedBoard = updateBoard(
          board,
          turn,
          counterRowIndex,
          colIndex
        );
        dispatch(setBoard(updatedBoard));

        const winner = checkWinner(updatedBoard);
        if (winner === null && numCounters < 41) {
          dispatch(switchTurn());
        }
      }
    }
  }

  const isDisabled =
    board[rowIndex][colIndex] !== '0' ||
    (mode === 'userVsAI' && turn === '2') ||
    (mode === 'aIVsUser' && turn === '1') ||
    status === 'gameOver';

  return (
    <div className={styles.container}>
      <Button
        className={styles[color]}
        disabled={isDisabled}
        onClick={handleClick}
        wrapperClassname={isWinner ? styles.winner : undefined}
      />
    </div>
  );
}
