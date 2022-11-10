import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthProvider';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const useAuthenticated = () => {
  const { status } = useContext(AuthContext);
  const user = useSelector((state: RootState) => state.user);

  return {
    status,
    user: status === 'unauthenticated' ? null : user,
  };
};

export default useAuthenticated;
