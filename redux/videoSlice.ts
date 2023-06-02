import { createSlice } from '@reduxjs/toolkit';

const initialState: { open: boolean } = {
  open: false,
};

export const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    toggleVideoOpen: (state) => {
      state.open = !state.open;
    },
  },
});

export const { toggleVideoOpen } = videoSlice.actions;

export default videoSlice.reducer;
