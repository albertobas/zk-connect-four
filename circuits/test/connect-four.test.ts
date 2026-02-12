import { assert } from 'chai';
import { describe } from 'mocha';
// eslint-disable-next-line -- Temporarily avoids the lint error warning
const wasmTester = require('circom_tester').wasm;

describe('Connect Four circuit', function () {
  let circuit: any;

  before(async function () {
    circuit = await wasmTester('connect_four.circom');
  });

  context('succeeds:', function () {
    it('calculating a witness for a valid board, winner and horizontal winning move coordinates', async function () {
      const input = {
        board: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [1, 2, 0, 0, 0, 0, 0],
          [2, 2, 0, 0, 0, 0, 0],
          [2, 2, 1, 1, 1, 1, 1]
        ],
        coordinates: [
          [5, 3],
          [5, 4],
          [5, 5],
          [5, 6]
        ],
        lastMove: [5, 3],
        winner: 1
      };
      const witness = await circuit.calculateWitness(input, true);
      await circuit.checkConstraints(witness);
    });

    it('calculating a witness for a valid board, winner and vertical winning move coordinates', async function () {
      const input = {
        board: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 1],
          [0, 0, 0, 0, 0, 0, 1],
          [0, 0, 0, 0, 0, 0, 1],
          [2, 2, 2, 0, 0, 0, 1]
        ],
        coordinates: [
          [2, 6],
          [3, 6],
          [4, 6],
          [5, 6]
        ],
        lastMove: [2, 6],
        winner: 1
      };
      const witness = await circuit.calculateWitness(input, true);
      await circuit.checkConstraints(witness);
    });

    it('calculating a witness for a valid board, winner and diagonal winning move coordinates', async function () {
      const input = {
        board: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [1, 0, 0, 0, 0, 0, 0],
          [2, 1, 0, 0, 0, 0, 0],
          [2, 2, 1, 0, 0, 0, 0],
          [2, 2, 2, 1, 1, 1, 0]
        ],
        coordinates: [
          [2, 0],
          [3, 1],
          [4, 2],
          [5, 3]
        ],
        lastMove: [2, 0],
        winner: 1
      };
      const witness = await circuit.calculateWitness(input, true);
      await circuit.checkConstraints(witness);
    });

    it('calculating a witness for a valid board, winner and antidiagonal winning move coordinates', async function () {
      const input = {
        board: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 1, 0, 0, 0],
          [0, 0, 1, 2, 0, 0, 0],
          [2, 1, 2, 2, 0, 0, 0],
          [1, 2, 2, 1, 1, 1, 0]
        ],
        coordinates: [
          [5, 0],
          [4, 1],
          [3, 2],
          [2, 3]
        ],
        lastMove: [2, 3],
        winner: 1
      };
      const witness = await circuit.calculateWitness(input, true);
      await circuit.checkConstraints(witness);
    });

    it('calculating a witness for a valid board that ends up in a draw', async function () {
      const input = {
        board: [
          [1, 1, 1, 2, 1, 1, 1],
          [1, 1, 1, 2, 1, 1, 1],
          [1, 1, 1, 2, 1, 1, 1],
          [2, 2, 2, 1, 2, 2, 2],
          [2, 2, 2, 1, 2, 2, 2],
          [2, 2, 2, 1, 2, 2, 2]
        ],
        coordinates: [
          [5, 0],
          [0, 0],
          [0, 0],
          [0, 0]
        ],
        lastMove: [0, 3],
        winner: 0
      };
      const witness = await circuit.calculateWitness(input, true);
      await circuit.checkConstraints(witness);
    });
  });

  context('fails:', function () {
    it('if there is more than one winning combination in a different line', async function () {
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
          [4, 3],
          [4, 4],
          [4, 5],
          [4, 6]
        ],
        lastMove: [4, 3],
        winner: 1
      };

      try {
        const witness = await circuit.calculateWitness(input, true);
        await circuit.checkConstraints(witness);
        assert.fail('Circuit should have failed but passed.');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        assert.include(
          errorMessage,
          'Assert Failed',
          'Expected an assertion failure'
        );
      }
    });

    it('when all counters are no either 0, 1 or 2', async function () {
      const input = {
        board: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 3, 0, 0, 0, 0, 0],
          [2, 2, 2, 0, 1, 1, 1],
          [2, 2, 2, 1, 1, 1, 1]
        ],
        coordinates: [
          [5, 3],
          [5, 4],
          [5, 5],
          [5, 6]
        ],
        lastMove: [5, 3],
        winner: 1
      };

      try {
        const witness = await circuit.calculateWitness(input, true);
        await circuit.checkConstraints(witness);
        assert.fail('Circuit should have failed but passed.');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        assert.include(
          errorMessage,
          'Assert Failed',
          'Expected an assertion failure'
        );
      }
    });

    it('if provided winner is neither 1 nor 2', async function () {
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
        lastMove: [5, 3],
        winner: 0
      };

      try {
        const witness = await circuit.calculateWitness(input, true);
        await circuit.checkConstraints(witness);
        assert.fail('Circuit should have failed but passed.');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        assert.include(
          errorMessage,
          'Assert Failed',
          'Expected an assertion failure'
        );
      }
    });

    it('when there is no winning combination', async function () {
      const input = {
        board: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [2, 2, 2, 0, 1, 1, 1]
        ],
        coordinates: [
          [5, 3],
          [5, 4],
          [5, 5],
          [5, 6]
        ],
        winner: 1,
        lastMove: [5, 4]
      };

      try {
        const witness = await circuit.calculateWitness(input, true);
        await circuit.checkConstraints(witness);
        assert.fail('Circuit should have failed but passed.');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        assert.include(
          errorMessage,
          'Assert Failed',
          'Expected an assertion failure'
        );
      }
    });

    it('if the provided winning combination is out of bounds', async function () {
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
          [5, 4],
          [5, 5],
          [5, 6],
          [5, 7]
        ],
        lastMove: [5, 3],
        winner: 1
      };

      try {
        const witness = await circuit.calculateWitness(input, true);
        await circuit.checkConstraints(witness);
        assert.fail('Circuit should have failed but passed.');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        assert.include(
          errorMessage,
          'Assert Failed',
          'Expected an assertion failure'
        );
      }
    });

    it('when the provided winning combination contains repeated coordinates', async function () {
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
          [5, 4],
          [5, 4],
          [5, 5],
          [5, 6]
        ],
        lastMove: [5, 3],
        winner: 1
      };

      try {
        const witness = await circuit.calculateWitness(input, true);
        await circuit.checkConstraints(witness);
        assert.fail('Circuit should have failed but passed.');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        assert.include(
          errorMessage,
          'Assert Failed',
          'Expected an assertion failure'
        );
      }
    });

    it('if the provided winning combination is not in a continuous straight line', async function () {
      const input = {
        board: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [2, 1, 0, 0, 0, 0, 0],
          [2, 2, 2, 1, 1, 1, 1]
        ],
        coordinates: [
          [4, 1],
          [5, 4],
          [5, 5],
          [5, 6]
        ],
        lastMove: [5, 3],
        winner: 1
      };

      try {
        const witness = await circuit.calculateWitness(input, true);
        await circuit.checkConstraints(witness);
        assert.fail('Circuit should have failed but passed.');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        assert.include(
          errorMessage,
          'Assert Failed',
          'Expected an assertion failure'
        );
      }
    });

    it('when player 1 has not at least the same pieces as player 2 or one more', async function () {
      const input = {
        board: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 1, 0, 0, 0],
          [2, 2, 2, 1, 1, 1, 1]
        ],
        coordinates: [
          [5, 3],
          [5, 4],
          [5, 5],
          [5, 6]
        ],
        lastMove: [5, 3],
        winner: 1
      };

      try {
        const witness = await circuit.calculateWitness(input, true);
        await circuit.checkConstraints(witness);
        assert.fail('Circuit should have failed but passed.');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        assert.include(
          errorMessage,
          'Assert Failed',
          'Expected an assertion failure'
        );
      }
    });

    it('if there are flying pieces', async function () {
      const input = {
        board: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 2, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 1, 0, 0],
          [2, 2, 2, 1, 1, 1, 1]
        ],
        coordinates: [
          [5, 3],
          [5, 4],
          [5, 5],
          [5, 6]
        ],
        lastMove: [5, 3],
        winner: 1
      };

      try {
        const witness = await circuit.calculateWitness(input, true);
        await circuit.checkConstraints(witness);
        assert.fail('Circuit should have failed but passed.');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        assert.include(
          errorMessage,
          'Assert Failed',
          'Expected an assertion failure'
        );
      }
    });

    it('when the last move has a piece above', async function () {
      const input = {
        board: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 2, 0, 1, 0, 0, 0],
          [2, 2, 2, 1, 1, 1, 1]
        ],
        coordinates: [
          [5, 3],
          [5, 4],
          [5, 5],
          [5, 6]
        ],
        lastMove: [5, 3],
        winner: 1
      };

      try {
        const witness = await circuit.calculateWitness(input, true);
        await circuit.checkConstraints(witness);
        assert.fail('Circuit should have failed but passed.');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        assert.include(
          errorMessage,
          'Assert Failed',
          'Expected an assertion failure'
        );
      }
    });

    it('if the last move equals wrongs value', async function () {
      const input = {
        board: [
          [1, 1, 1, 2, 1, 1, 1],
          [1, 1, 1, 2, 1, 1, 1],
          [1, 1, 1, 2, 1, 1, 1],
          [2, 2, 2, 1, 2, 2, 2],
          [2, 2, 2, 1, 2, 2, 2],
          [2, 2, 2, 1, 2, 2, 2]
        ],
        coordinates: [
          [0, 0],
          [0, 0],
          [0, 0],
          [0, 0]
        ],
        lastMove: [0, 2],
        winner: 0
      };

      try {
        const witness = await circuit.calculateWitness(input, true);
        await circuit.checkConstraints(witness);
        assert.fail('Circuit should have failed but passed.');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        assert.include(
          errorMessage,
          'Assert Failed',
          'Expected an assertion failure'
        );
      }
    });

    it('when coordinates have a (0,0) step if there is a winner', async function () {
      const input = {
        board: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 2, 0, 0, 0, 0, 0],
          [2, 2, 2, 1, 1, 1, 1]
        ],
        coordinates: [
          [5, 3],
          [5, 3],
          [5, 3],
          [5, 3]
        ],
        lastMove: [5, 3],
        winner: 1
      };

      try {
        const witness = await circuit.calculateWitness(input, true);
        await circuit.checkConstraints(witness);
        assert.fail('Circuit should have failed but passed.');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        assert.include(
          errorMessage,
          'Assert Failed',
          'Expected an assertion failure'
        );
      }
    });
  });
});
