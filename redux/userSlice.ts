import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { User } from 'schemas';

const initialState: Omit<Required<User>, 'description'> = {
  _id: '',
  kakaoId: 0,
  name: '',
  email: '',
  imageUrl: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state._id = action.payload._id;
      state.kakaoId = action.payload.kakaoId;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.imageUrl = action.payload.imageUrl ?? '';
    },
    resetUser: (state) => {
      state._id = '';
      state.kakaoId = 0;
      state.name = '';
      state.email = '';
      state.imageUrl = '';
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
