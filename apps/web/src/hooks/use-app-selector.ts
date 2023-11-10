import { type TypedUseSelectorHook, useSelector } from 'react-redux';
import { type RootState } from '../types/connect-four';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
