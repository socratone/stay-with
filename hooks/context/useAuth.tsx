import jwtDecode from 'jwt-decode';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { resetUser, setUser } from 'redux/userSlice';
import { User } from 'types/interfaces';
import { removeAccessToken, saveAccessToken } from 'utils/token';

const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

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
