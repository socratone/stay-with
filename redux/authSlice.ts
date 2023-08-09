import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

const initialState: { accessToken: string | null } = {
  accessToken: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
    },
  },
});

export const { setAccessToken } = authSlice.actions;

export default authSlice.reducer;
