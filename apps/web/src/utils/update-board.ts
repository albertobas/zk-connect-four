import {
  type ConnectFourPlayer,
  type ConnectFourBoard
} from '../types/connect-four';

/**
 * It takes a board observation `board` and adds a counter at indexes
 * [`row`, `col`] with the value `turn`.
 * @param board - Connect Four board.
 * @param turn - Current turn in the game.
 * @param row - Row index of the counter.
 * @param col - Columm index of the counter.
 * @returns The updated board.
 */
export function updateBoard(
  board: ConnectFourBoard,
  turn: ConnectFourPlayer,
  row: number,
  col: number
): ConnectFourBoard {
  const updatedBoard = [...board];
  const newRow = [...updatedBoard[row]];
  newRow[col] = turn;
  updatedBoard[row] = [...newRow];
  return updatedBoard;
}
