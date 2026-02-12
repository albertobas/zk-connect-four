import {
  type ConnectFourMode,
  type ConnectFourBoard
} from '../types/connect-four';

export const initialBoard: ConnectFourBoard = [
  ['0', '0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', '0', '0']
];

export const dictMode: Record<ConnectFourMode, string> = {
  userVsAI: 'User Vs AI',
  aIVsUser: 'AI Vs User',
  userVsUser: 'User Vs User'
};
