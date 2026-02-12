import type { Address } from 'viem';
import { type store } from '../state';

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export type ConnectFourPlayer = '1' | '2';
export type ConnectFourStatus = 'IDLE' | 'PLAYING' | 'GAME_OVER';
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
  lastMove: ConnectFourCoordinates | null;
  verification: {
    status: VerificationStatus;
    txHash: Address | null;
    blockNumber: string | null;
    isValid: boolean | null;
  };
}
export type ColorType = 'player1' | 'player2' | 'empty';

export interface EventsProps {
  address: Address;
  abi: any;
  eventName: string;
  txHash: Address | null;
  fromBlock?: bigint | 'latest' | 'earliest' | 'pending' | 'safe' | 'finalized';
  toBlock?: bigint | 'latest' | 'earliest' | 'pending' | 'safe' | 'finalized';
  pollInterval?: number;
  shouldStopPolling?: boolean;
}

export type VerificationStatus =
  | 'IDLE'
  | 'GENERATING_PROOF'
  | 'WAITING_FOR_TX'
  | 'TX_SUCCESS'
  | 'FETCHING_EVENT'
  | 'VERIFIED'
  | 'ERROR';
