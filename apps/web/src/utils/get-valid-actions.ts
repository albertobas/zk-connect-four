import { type ConnectFourBoard } from '../types/connect-four';
import { getRowIndex } from './get-row-index';

/**
 * Gets the predicted valid action or null if the board is full.
 * @param board - Connect Four board.
 * @param output - Array of numbers with the predicted values for each column.
 * @returns The predicted valid action or null.
 */
export function getPredictedValidAction(
  board: ConnectFourBoard,
  output: number[]
): number | null {
  // get all valid actions
  const validActions = getValidActions(board);
  if (validActions === null) {
    return null;
  }
  // get maximum valid value
  const maxValidValue = Math.max(...validActions.map((idx) => output[idx]));
  // get the index of the maximum valid value
  const predictedValidAction = output.indexOf(maxValidValue);

  return predictedValidAction;
}

/**
 * Gets the indexes of the columns where it is valid to play.
 * @param board - Connect Four board.
 * @returns An array with the indexes or null if the board is full.
 */
function getValidActions(board: ConnectFourBoard): number[] | null {
  const validActions = [];

  const columns = [0, 1, 2, 3, 4, 5, 6];
  for (const colIndex of columns) {
    const rowIndex = getRowIndex(board, colIndex);
    if (rowIndex !== null) {
      validActions.push(colIndex);
    }
  }
  return validActions.length === 0 ? null : validActions;
}
