import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import colorReducer from './colorSlice';
import tempLexioDivinaReducer from './tempLexioDivinaSlice';
import userReducer from './userSlice';
import videoReducer from './videoSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    color: colorReducer,
    tempLexioDivina: tempLexioDivinaReducer,
    user: userReducer,
    video: videoReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
