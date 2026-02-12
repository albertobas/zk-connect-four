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
 * @param lastMove - The coordinates of the winning counters.
 * @returns The proof and public signals.
 */
export async function generateProof(
  board: ConnectFourBoard,
  winner: ConnectFourWinner,
  lastMove: ConnectFourCoordinates
): Promise<{ proofBytes: string; pubSignals: bigint[] }> {
  // 1- calculate a witness and generate a proof
  const { player, coordinates } = winner;
  const inputs = {
    board: getIntBoard(board),
    winner: player,
    coordinates: getIntCoordinatesArray(coordinates),
    lastMove: getIntCoordinates(lastMove)
  };
  // paths to the .wasm file and proving key
  const wasmPath = 'zk/connect_four.wasm';
  const provingKeyPath = 'zk/proving_key.zkey';
  const { proof, publicSignals } = await plonk.fullProve(
    inputs,
    wasmPath,
    provingKeyPath
  );
  // 2 - generate the solidity calldata
  const calldata: string = await plonk.exportSolidityCallData(
    proof,
    publicSignals
  );
  // 3 - parse the proof and signals
  const firstComma = calldata.indexOf(',');
  if (firstComma === -1) {
    throw new Error('Invalid PLONK calldata format');
  }
  const proofBytes = calldata.slice(0, firstComma);
  const pubSignalsRaw = calldata.slice(firstComma + 1); // "[...]" or "[]"
  const parsedSignals: string[] = JSON.parse(pubSignalsRaw);
  const pubSignals = parsedSignals.map((x) => BigInt(x));

  return {
    proofBytes,
    pubSignals
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
function getIntCoordinatesArray(
  coordinates: ConnectFourCoordinates[]
): number[][] {
  const intCoord: number[][] = [];
  for (let i = 0; i < coordinates.length; i++) {
    const [row, col] = getIntCoordinates(coordinates[i]);
    intCoord[i] = [];
    intCoord[i][0] = row;
    intCoord[i][1] = col;
  }
  return intCoord;
}

/**
 * Gets a ConnectFourCoordinates object and returns an array of coordinate numbers.
 * @param coordinates - The coordinates of a counter.
 * @returns An array of coordinate numbers.
 */
function getIntCoordinates(coordinates: ConnectFourCoordinates): number[] {
  const { row, col } = coordinates;
  if (row === null || col === null) {
    throw new Error('getIntCoordinates is trying to assert null coordinates.');
  }
  return [row, col];
}
