import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { LexioDivinaFormValues } from 'components/LexioDivinaForm/LexioDivinaForm';

const initialState: Partial<LexioDivinaFormValues> & { id?: string } = {};

export const userSlice = createSlice({
  name: 'tempLexioDivina',
  initialState,
  reducers: {
    setTempLexioDivina: (
      state,
      action: PayloadAction<LexioDivinaFormValues & { id?: string }>
    ) => {
      return action.payload;
    },
    resetTempLexioDivina: () => {
      return {};
    },
  },
});

export const { setTempLexioDivina, resetTempLexioDivina } = userSlice.actions;

export default userSlice.reducer;
