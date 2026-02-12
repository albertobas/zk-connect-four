import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState
} from 'react';
import {
  connectFourSelector,
  switchTurn,
  setBoard,
  setLastMove
} from '../state';
import { checkWinner, getPrediction, getRowIndex, updateBoard } from '../utils';
import { useAppDispatch } from './use-app-dispatch';
import { useAppSelector } from './use-app-selector';

/**
 * Hook to update the Connect Four state when playing User vs AI or AI vs User.
 * This hook will:
 * - update the board whenever state coordinates change, and switch the turn.
 * - create an inference session of a onnx model when it is AI's turn. Then set coordinates
 *   for that move to the state.
 * - check if there is a winner and change the status of the game accordingly.
 * - check if there is a tie and change the status of the game accordingly.
 *
 * @returns An object with a boolean that shows whether there is a minimum time
 *   in every turn or not, and a setter for this boolean.
 */
export function useAI(): {
  isSlow: boolean;
  setIsSlow: Dispatch<SetStateAction<boolean>>;
} {
  const { status, turn, board, numCounters, mode } =
    useAppSelector(connectFourSelector);
  const dispatch = useAppDispatch();
  const timerId = useRef<null | NodeJS.Timeout>(null); // eslint-disable-line -- allow undef
  const [isSlow, setIsSlow] = useState<boolean>(true);

  // trigger AI
  useEffect(() => {
    const predict = async (): Promise<void> => {
      try {
        const colIndex = await getPrediction(board);
        if (colIndex === null) {
          console.warn(
            'Error: unable to get a row index from the predicted column index.'
          );
        } else {
          const rowIndex = getRowIndex(board, colIndex);
          if (rowIndex !== null) {
            const updatedBoard = updateBoard(board, turn, rowIndex, colIndex);
            dispatch(setBoard(updatedBoard));
            dispatch(setLastMove({ row: rowIndex, col: colIndex }));
            // check that this move does neither win nor draw the game before switching the turn
            const winner = checkWinner(updatedBoard);
            if (winner === null && numCounters < 41) {
              dispatch(switchTurn());
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (
      ((mode === 'userVsAI' && turn === '2') ||
        (mode === 'aIVsUser' && turn === '1')) &&
      status !== 'GAME_OVER'
    ) {
      timerId.current = setTimeout(
        () => {
          // get the prediction
          predict(); // eslint-disable-line -- allow floating promise
        },
        isSlow ? 1000 : 0
      );
    }

    return () => {
      if (timerId.current !== null) {
        clearTimeout(timerId.current);
      }
    };
  }, [mode, status, board, turn, dispatch, isSlow, numCounters]);

  return { isSlow, setIsSlow };
}
