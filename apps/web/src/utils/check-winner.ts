import {
  type ConnectFourBoard,
  type ConnectFourWinner
} from '../types/connect-four';

/**
 * Checks whether there is a winner.
 * @param board - Connect Four board.
 * @returns A ConnectFourWinner object or null if there is no winner.
 */
export function checkWinner(board: ConnectFourBoard): ConnectFourWinner | null {
  const numRows = board.length;
  const numCols = board[0].length;
  // horizontal
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols - 3; col++) {
      const player = board[row][col];
      if (
        player !== '0' &&
        board[row][col] === board[row][col + 1] &&
        board[row][col + 1] === board[row][col + 2] &&
        board[row][col + 2] === board[row][col + 3]
      ) {
        return {
          player,
          coordinates: [
            { row, col },
            { row, col: col + 1 },
            { row, col: col + 2 },
            { row, col: col + 3 }
          ]
        };
      }
    }
  }
  // vertical
  for (let col = 0; col < numCols; col++) {
    for (let row = 0; row < numRows - 3; row++) {
      const player = board[row][col];
      if (
        player !== '0' &&
        board[row][col] === board[row + 1][col] &&
        board[row + 1][col] === board[row + 2][col] &&
        board[row + 2][col] === board[row + 3][col]
      ) {
        return {
          player,
          coordinates: [
            { row, col },
            { row: row + 1, col },
            { row: row + 2, col },
            { row: row + 3, col }
          ]
        };
      }
    }
  }
  // diagonal
  for (let row = 3; row < numRows; row++) {
    for (let col = 0; col < numCols - 3; col++) {
      const player = board[row][col];
      if (
        player !== '0' &&
        board[row][col] === board[row - 1][col + 1] &&
        board[row - 1][col + 1] === board[row - 2][col + 2] &&
        board[row - 2][col + 2] === board[row - 3][col + 3]
      ) {
        return {
          player,
          coordinates: [
            { row, col },
            { row: row - 1, col: col + 1 },
            { row: row - 2, col: col + 2 },
            { row: row - 3, col: col + 3 }
          ]
        };
      }
    }
  }
  // anti-diagonal
  for (let row = 0; row < numRows - 3; row++) {
    for (let col = 0; col < numCols - 3; col++) {
      const player = board[row][col];
      if (
        player !== '0' &&
        board[row][col] === board[row + 1][col + 1] &&
        board[row + 1][col + 1] === board[row + 2][col + 2] &&
        board[row + 2][col + 2] === board[row + 3][col + 3]
      ) {
        return {
          player,
          coordinates: [
            { row, col },
            { row: row + 1, col: col + 1 },
            { row: row + 2, col: col + 2 },
            { row: row + 3, col: col + 3 }
          ]
        };
      }
    }
  }
  return null;
}
