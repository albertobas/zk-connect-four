import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  type ConnectFourState,
  type RootState,
  type ConnectFourStatus,
  type ConnectFourCoordinates,
  type ConnectFourPlayer,
  type ConnectFourMode,
  type ConnectFourBoard
} from '../types/connect-four';
import { initialBoard } from '../constants';

// initial state
const initialState: ConnectFourState = {
  board: initialBoard,
  status: 'start',
  mode: null,
  turn: '1',
  numCounters: 0,
  winner: null
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
    }
  }
});

export const {
  resetGame,
  setMode,
  setStatus,
  switchTurn,
  setWinner,
  setBoard
} = connectFourSlice.actions;
export const connectFourSelector = (state: RootState): ConnectFourState =>
  state.connectFour;
export default connectFourSlice.reducer;
