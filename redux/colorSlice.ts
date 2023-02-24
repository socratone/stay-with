import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

const initialState: { mode: 'dark' | 'light' | 'none' } = {
  mode: 'none',
};

export const colorSlice = createSlice({
  name: 'color',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.mode = action.payload;
    },
  },
});

export const { setMode } = colorSlice.actions;

export default colorSlice.reducer;
