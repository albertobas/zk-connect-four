import { configureStore } from '@reduxjs/toolkit';
import connectFourSliceReducer from './connect-four-slice';

export const store = configureStore({
  reducer: {
    connectFour: connectFourSliceReducer
  }
});
