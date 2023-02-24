import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import colorReducer from './colorSlice';
import userReducer from './userSlice';

const reducers = combineReducers({
  user: userReducer,
  color: colorReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'color'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  // https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
