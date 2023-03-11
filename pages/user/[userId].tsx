import Box from '@mui/material/Box';
import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import GlobalHeader from 'components/GlobalHeader';
import LoadingCircular from 'components/LoadingCircular/LoadingCircular';
import Meta from 'components/Meta';
import LexioDivinas from 'feature/LexioDivinas';
import UserInfo from 'feature/UserInfo/UserInfo';
import useUser from 'hooks/api/useUser';
import { useRouter } from 'next/router';

const UserId = () => {
  const router = useRouter();
  const userId = router.query.userId ? String(router.query.userId) : undefined;
  const { data: userData, isLoading, isError } = useUser(userId);

  if (isLoading) {
    return (
      <>
        <GlobalHeader />
        <Box p={2}>
          <LoadingCircular />
        </Box>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <GlobalHeader />
        <Box p={2}>
          <ErrorMessage />
        </Box>
      </>
    );
  }

  return (
    <>
      <Meta />
      <GlobalHeader />
      <UserInfo userId={userData?.user._id} />
      <LexioDivinas
        fetchOptions={{
          userId: userData?.user._id,
        }}
      />
    </>
  );
};

export default UserId;
