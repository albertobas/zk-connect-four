import type { Address } from 'viem';
import { type store } from '../state';

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export type ConnectFourPlayer = '1' | '2';
export type ConnectFourStatus = 'start' | 'playing' | 'gameOver';
export interface ConnectFourCoordinates {
  row: number | null;
  col: number | null;
}
export type ConnectFourRow = (ConnectFourPlayer | '0')[];
export type ConnectFourBoard = ConnectFourRow[];
export type ConnectFourMode = 'userVsAI' | 'aIVsUser' | 'userVsUser';
export interface ConnectFourWinner {
  player: ConnectFourPlayer;
  coordinates: ConnectFourCoordinates[];
}
export interface ConnectFourState {
  board: ConnectFourBoard;
  status: ConnectFourStatus;
  mode: ConnectFourMode | null;
  turn: ConnectFourPlayer;
  numCounters: number;
  winner: ConnectFourWinner | null;
}
export type ColorType = 'player1' | 'player2' | 'empty';
export type Network = 'sepolia' | 'localhost';

export interface EventsProps {
  address: Address;
  abi: any;
  eventName: string;
  fromBlock?: bigint | 'latest' | 'earliest' | 'pending' | 'safe' | 'finalized';
  toBlock?: bigint | 'latest' | 'earliest' | 'pending' | 'safe' | 'finalized';
  pollInterval?: number;
  shouldStopPolling?: boolean;
}
