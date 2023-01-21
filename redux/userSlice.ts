import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { User } from '../libs/firebase/interfaces';

const initialState: Required<User> = {
  id: '',
  googleId: '',
  name: '',
  email: '',
  image: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.id = action.payload.id;
      state.googleId = action.payload.googleId;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.image = action.payload.image ?? '';
    },
    resetUser: (state) => {
      state.id = '';
      state.googleId = '';
      state.name = '';
      state.email = '';
      state.image = '';
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
