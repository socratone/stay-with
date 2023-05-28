import jwtDecode from 'jwt-decode';
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { resetUser, setUser } from 'redux/userSlice';
import { User } from 'schemas';
import {
  getAccessToken,
  removeAccessToken,
  saveAccessToken,
} from 'utils/token';

const useAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    const accessToken = getAccessToken();

    if (accessToken) {
      const user: User = jwtDecode(accessToken);
      dispatch(setUser(user));
    } else {
      dispatch(resetUser());
    }
  }, [dispatch]);

  const login = useCallback(
    (accessToken: string) => {
      saveAccessToken(accessToken);
      const user: User = jwtDecode(accessToken);
      dispatch(setUser(user));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    removeAccessToken();
    dispatch(resetUser());
  }, [dispatch]);

  return {
    user: user._id ? user : null,
    login,
    logout,
  };
};

export default useAuth;
