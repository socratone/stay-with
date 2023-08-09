import { setAccessToken } from 'redux/authSlice';
import { store } from 'redux/store';

export const saveAccessToken = (accessToken: string) => {
  store.dispatch(setAccessToken(accessToken));
};

export const removeAccessToken = () => {
  store.dispatch(setAccessToken(null));
};

export const getAccessToken = () => {
  return store.getState().auth.accessToken;
};
