import { type ConnectFourBoard } from '../types/connect-four';

/**
 * Validates whether the move obeys the rules of the game.
 * @param board - Connect Four board.
 * @param row - Row index of the counter.
 * @param col - Columm index of the counter.
 * @returns Whether the move is valid or not.
 */
export function validateMove(
  board: ConnectFourBoard,
  row: number,
  col: number
): boolean {
  // if column is full of counters
  if (board[0][col] !== '0') {
    return false;
  }
  // if row and column leave empty spaces below the counter
  if (row !== board.length - 1 && board[row + 1][col] === '0') {
    return false;
  }
  return true;
}
