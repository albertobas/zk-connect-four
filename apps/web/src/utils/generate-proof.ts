import type {
  ConnectFourWinner,
  ConnectFourBoard,
  ConnectFourCoordinates
} from '../types/connect-four';
// eslint-disable-next-line -- allow var require
const plonk = require('snarkjs').plonk;

/**
 * Generates a zk-SNARK and returns both the proof and public signals.
 * @param board - Connect Four board.
 * @param winner - The winnner of the game.
 * @param coordinates - The coordinates of the winning counters.
 * @returns The proof and public signals.
 */
export async function generateProof(
  board: ConnectFourBoard,
  winner: ConnectFourWinner
): Promise<{ proof: string; publicSignals: string[] }> {
  const { player, coordinates } = winner;
  // inputs to the circuit
  const inputs = {
    board: getIntBoard(board),
    winner: parseInt(player),
    coordinates: getIntCoordinates(coordinates)
  };
  // paths to the .wasm file and proving key
  const wasmPath = 'zk/connect-four.wasm';
  const provingKeyPath = 'zk/proving-key.zkey';
  // calculate a witness and generate a proof
  const { proof, publicSignals } = await plonk.fullProve(
    inputs,
    wasmPath,
    provingKeyPath
  );
  const rawCalldata: string = await plonk.exportSolidityCallData(
    proof,
    publicSignals
  );
  const calldata = rawCalldata.split(',');

  return {
    proof: calldata[0],
    publicSignals: JSON.parse(calldata[1])
  };
}

/**
 * Gets the board with string values and returns the board with integer values.
 * @param board - Connect Four board.
 * @returns The board with integer values.
 */
function getIntBoard(board: ConnectFourBoard): number[][] {
  const intBoard: number[][] = [];

  for (let i = 0; i < board.length; i++) {
    intBoard[i] = [];
    for (let j = 0; j < board[0].length; j++) {
      intBoard[i][j] = parseFloat(board[i][j]);
    }
  }

  return intBoard;
}

/**
 * Gets an array of ConnectFourCoordinates objects and returns an array of array coordinate
 * numbers.
 * @param coordinates - The coordinates of the winning counters.
 * @returns An array of array coordinate numbers.
 */
function getIntCoordinates(coordinates: ConnectFourCoordinates[]): number[][] {
  const intCoord: number[][] = [];
  for (let i = 0; i < coordinates.length; i++) {
    const { row, col } = coordinates[i];
    if (row === null || col === null) {
      throw new Error(
        'getIntCoordinates is trying to assert null coordinates.'
      );
    }
    intCoord[i] = [];
    intCoord[i][0] = row;
    intCoord[i][1] = col;
  }
  return intCoord;
}
