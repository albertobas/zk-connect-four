import { assert } from 'chai';
import { describe } from 'mocha';
// eslint-disable-next-line -- Temporarily avoids the lint error warning
const wasmTester = require('circom_tester').wasm;

describe('Connect Four circuit', function () {
  let circuit: any;
  const errorMessage = 'Error: Assert Failed.';
  const unknownErrorMessage = 'Unknown error.';

  before(async function () {
    circuit = await wasmTester('connect-four.circom');
  });

  context('succeeds:', function () {
    it('calculating a witness for a valid board, winner and winning move coordinates', async function () {
      const input = {
        board: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [2, 2, 2, 1, 1, 1, 1]
        ],
        coordinates: [
          [5, 3],
          [5, 4],
          [5, 5],
          [5, 6]
        ],
        winner: '1'
      };
      const witness = await circuit.calculateWitness(input);
      await circuit.assertOut(witness, {});
    });
  });

  context('fails:', function () {
    it('calculating a witness for a valid winner and winning move but invalid board', async function () {
      const input = {
        board: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 2, 0, 0, 0, 0],
          [2, 2, 2, 1, 1, 1, 1],
          [2, 2, 2, 1, 1, 1, 1]
        ],
        coordinates: [
          [5, 3],
          [5, 4],
          [5, 5],
          [5, 6]
        ],
        winner: 1
      };

      try {
        await circuit.calculateWitness(input);
      } catch (error) {
        if (error instanceof Error) {
          assert(error.message.includes(errorMessage));
        } else {
          assert.fail(unknownErrorMessage);
        }
      }
    });

    it('calculating a witness for a valid board and winning move coordinates but invalid winner', async function () {
      const input = {
        board: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [2, 2, 2, 1, 1, 1, 1]
        ],
        coordinates: [
          [5, 3],
          [5, 4],
          [5, 5],
          [5, 6]
        ],
        winner: 2
      };

      try {
        await circuit.calculateWitness(input);
      } catch (error) {
        if (error instanceof Error) {
          assert(error.message.includes(errorMessage));
        } else {
          assert.fail(unknownErrorMessage);
        }
      }
    });

    it('calculating a witness for a valid board and winner but invalid winning move coordinates', async function () {
      const input = {
        board: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [2, 2, 2, 1, 1, 1, 1]
        ],
        coordinates: [
          [5, 2],
          [5, 3],
          [5, 4],
          [5, 5]
        ],
        winner: 1
      };

      try {
        await circuit.calculateWitness(input);
      } catch (error) {
        if (error instanceof Error) {
          assert(error.message.includes(errorMessage));
        } else {
          assert.fail(unknownErrorMessage);
        }
      }
    });
  });
});
