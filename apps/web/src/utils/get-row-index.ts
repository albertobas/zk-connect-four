import { type ConnectFourBoard } from '../types/connect-four';

/**
 * Gets the appropiate row index for a given column index.
 * @param board - Connect Four board.
 * @param colIndex - Columm index of the counter.
 * @returns The row index or null if the column has no empty slots.
 */
export function getRowIndex(
  board: ConnectFourBoard,
  colIndex: number
): number | null {
  let chosenRowIndex: number | null = null;
  for (let rowIndex = 5; rowIndex > -1; rowIndex--) {
    if (board[rowIndex][colIndex] === '0') {
      chosenRowIndex = rowIndex;
      break;
    }
  }
  return chosenRowIndex;
}
