import { useDispatch } from 'react-redux';
import {
  type AnyAction,
  type Dispatch,
  type ThunkDispatch
} from '@reduxjs/toolkit';
import { type AppDispatch, type ConnectFourState } from '../types/connect-four';

export const useAppDispatch = (): ThunkDispatch<
  {
    connectFour: ConnectFourState;
  },
  undefined,
  AnyAction
> &
  Dispatch => useDispatch<AppDispatch>();
