import { configureStore } from '@reduxjs/toolkit';

import colorReducer from './colorSlice';
import tempLexioDivinaReducer from './tempLexioDivinaSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    color: colorReducer,
    tempLexioDivina: tempLexioDivinaReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
