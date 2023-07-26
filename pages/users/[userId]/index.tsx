import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import FloatingButton from 'components/FloatingButton/FloatingButton';
import LoadingCircular from 'components/LoadingCircular/LoadingCircular';
import LexioDivinas from 'feature/lexio-divina/LexioDivinas';
import UserInfo from 'feature/UserInfo/UserInfo';
import useUser from 'hooks/api/useUser';
import useAuth from 'hooks/auth/useAuth';
import useScrollDirection from 'hooks/dom/useScrollDirection';
import { useRouter } from 'next/router';

const UserId = () => {
  const router = useRouter();

  const { user } = useAuth();
  const isLoggedIn = !!user;
  const { scrollDirection } = useScrollDirection();
  const userId =
    typeof router.query.userId === 'string' ? router.query.userId : undefined;
  const { data: userData, isLoading, isError } = useUser(userId);

  if (isLoading) {
    return (
      <Box p={2}>
        <LoadingCircular />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box p={2}>
        <ErrorMessage />
      </Box>
    );
  }

  const handleAdd = () => {
    router.push('/lexio-divinas/create');
  };

  return (
    <>
      <UserInfo userId={userData?.user._id} />
      <LexioDivinas
        fetchOptions={{
          userId: userData?.user._id,
        }}
      />
      {isLoggedIn ? (
        <FloatingButton
          icon={<AddIcon />}
          hidden={scrollDirection === 'down'}
          onClick={handleAdd}
        />
      ) : null}
    </>
  );
};

export default UserId;
