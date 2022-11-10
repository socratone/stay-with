import { useSession } from 'next-auth/react';
import { createContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { resetUser } from '../redux/userSlice';

interface AuthProviderProps {
  children: React.ReactNode;
}

type Status = 'authenticated' | 'loading' | 'unauthenticated';

export const AuthContext = createContext({
  status: 'loading' as Status,
});

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      dispatch(resetUser());
    }
  }, [dispatch, status]);

  return (
    <AuthContext.Provider
      value={{
        status,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
