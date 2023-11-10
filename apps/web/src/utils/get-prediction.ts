import * as ort from 'onnxruntime-web';
import { Tensor } from 'onnxruntime-web';
import { type ConnectFourBoard } from '../types/connect-four';
import { getPredictedValidAction } from './get-valid-actions';

/**
 * Gets the game board and returns a prediction of a model for a column index.
 * @param board - Connect Four board.
 * @returns A prediction of a model for a column index.
 */
export async function getPrediction(
  board: ConnectFourBoard
): Promise<number | null> {
  // get input tensor
  const inputTensor = getBoardTensor(board);
  // run model
  const output = await runConnectFourModel(inputTensor);
  // enforce a valid action
  const action = getPredictedValidAction(board, output);

  return action;
}

/**
 * Gets the Connect Four board and returns a Float32-typed Tensor version of it.
 * @param board - Connect Four board.
 * @returns A Float32-typed Tensor version of `board`.
 */
function getBoardTensor(board: ConnectFourBoard): ort.TypedTensor<'float32'> {
  const floatBoard: number[][] = [];
  let concatBoard: number[] = [];

  for (let i = 1; i < 3; i++) {
    for (let j = 0; j < board.length; j++) {
      floatBoard[j] = [];
      for (let k = 0; k < board[0].length; k++) {
        if (parseFloat(board[j][k]) === i) {
          floatBoard[j][k] = 1;
        } else {
          floatBoard[j][k] = 0;
        }
      }
      concatBoard = concatBoard.concat(floatBoard[j]);
    }
  }

  const floatArr = new Float32Array(2 * 6 * 7);

  for (let i = 0; i < concatBoard.length; i++) {
    floatArr[i] = concatBoard[i];
  }

  const inputTensor = new Tensor('float32', floatArr, [1, 2, 6, 7]);

  return inputTensor;
}

/**
 * Executes the model asynchronously and returns an array with the prediction for all column indexes.
 * @param session - Runtime instance of an ONNX model.
 * @param inputTensor - A numeric tensor object version ob the Connect Four board.
 * @returns The predictions for all column indexes.
 */
async function runConnectFourModel(inputTensor: ort.Tensor): Promise<number[]> {
  // create session and set options. See the docs here for more options:
  // https://onnxruntime.ai/docs/api/js/interfaces/InferenceSession.SessionOptions.html#graphOptimizationLevel
  const session = await ort.InferenceSession.create(
    './_next/static/chunks/pages/ConnectFourNet_2023_10_29_T_20_28_55.onnx',
    {
      executionProviders: ['webgl'],
      graphOptimizationLevel: 'all'
    }
  );
  if (process.env.NODE_ENV === 'development') {
    console.log('Inference session created'); // eslint-disable-line -- Allow logging while in development
  }
  // create feeds with the input name from model export and the preprocessed data.
  const feeds: Record<string, ort.Tensor> = {};
  feeds[session.inputNames[0]] = inputTensor;
  // get the inference
  const sessionOutput = await session.run(feeds);
  // cast inference array with predictions to number array
  const output = [...sessionOutput[session.outputNames[0]].data] as number[];

  return output;
}
