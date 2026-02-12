import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Address } from 'viem';
import type {
  VerificationStatus,
  ConnectFourState,
  RootState,
  ConnectFourStatus,
  ConnectFourCoordinates,
  ConnectFourPlayer,
  ConnectFourMode,
  ConnectFourBoard
} from '../types/connect-four';
import { initialBoard } from '../constants/game';

// initial state
const initialState: ConnectFourState = {
  board: initialBoard,
  status: 'IDLE',
  mode: null,
  turn: '1',
  numCounters: 0,
  winner: null,
  lastMove: null,
  verification: {
    status: 'IDLE',
    txHash: null,
    isValid: null,
    blockNumber: null
  }
};

// slice
const connectFourSlice = createSlice({
  name: 'connectFour',
  initialState,
  reducers: {
    resetGame: (state) => {
      state.board = initialBoard;
      state.numCounters = 0;
      state.turn = '1';
      state.winner = null;
      state.verification.status = 'IDLE';
      state.verification.txHash = null;
      state.verification.blockNumber = null;
      state.verification.isValid = null;
      state.lastMove = null;
    },
    setMode: (state, { payload }: PayloadAction<ConnectFourMode | null>) => {
      state.mode = payload;
    },
    setStatus: (state, { payload }: PayloadAction<ConnectFourStatus>) => {
      state.status = payload;
    },
    switchTurn: (state) => {
      state.turn = state.turn === '1' ? '2' : '1';
    },
    setWinner: (
      state,
      {
        payload
      }: PayloadAction<{
        player: ConnectFourPlayer;
        coordinates: ConnectFourCoordinates[];
      } | null>
    ) => {
      state.winner = payload;
    },
    setBoard(state, { payload }: PayloadAction<ConnectFourBoard>) {
      state.board = payload;
      state.numCounters += 1;
    },
    setVerificationStatus: (
      state,
      { payload }: PayloadAction<VerificationStatus>
    ) => {
      state.verification.status = payload;
    },
    setTransactionData: (
      state,
      {
        payload: { blockNumber, hash }
      }: PayloadAction<{ hash: Address | null; blockNumber: string | null }>
    ) => {
      state.verification.txHash = hash;
      state.verification.blockNumber = blockNumber;
    },
    resetVerification: (state) => {
      state.verification.status = 'IDLE';
      state.verification.txHash = null;
      state.verification.blockNumber = null;
      state.verification.isValid = null;
    },
    setVerifiedResult: (state, { payload }: PayloadAction<boolean>) => {
      state.verification.isValid = payload;
      state.verification.status = 'VERIFIED';
    },
    setLastMove: (
      state,
      { payload }: PayloadAction<ConnectFourCoordinates | null>
    ) => {
      state.lastMove = payload;
    }
  }
});

export const {
  resetGame,
  setMode,
  setStatus,
  switchTurn,
  setWinner,
  setBoard,
  setVerificationStatus,
  setTransactionData,
  resetVerification,
  setVerifiedResult,
  setLastMove
} = connectFourSlice.actions;
export const connectFourSelector = (state: RootState): ConnectFourState =>
  state.connectFour;
export default connectFourSlice.reducer;
