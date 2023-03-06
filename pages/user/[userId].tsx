import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import GlobalHeader from 'components/GlobalHeader';
import LoadingCircular from 'components/LoadingCircular/LoadingCircular';
import Meta from 'components/Meta';
import useUser from 'hooks/api/useUser';
import useAuth from 'hooks/context/useAuth';
import { useRouter } from 'next/router';
import LexioDivinas from 'sections/LexioDivinas';

const UserId = () => {
  const router = useRouter();
  const userId = router.query.userId ? String(router.query.userId) : undefined;
  const { data: userData, isLoading, isError } = useUser(userId);
  const { user: me, logout } = useAuth();
  const isLoggedIn = !!me;

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

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        pt={2}
        px={2}
      >
        <Box display="flex" gap={1} alignItems="center">
          {userData?.user.imageUrl ? (
            <Avatar alt="Profile" src={userData?.user.imageUrl} />
          ) : (
            <Avatar sx={{ width: 34, height: 34 }}>
              {userData?.user.name?.[0] ?? 'P'}
            </Avatar>
          )}
          <Typography color="text.primary" fontWeight={500}>
            {userData?.user.name}
          </Typography>
        </Box>
        {isLoggedIn ? <Button onClick={logout}>로그아웃</Button> : null}
      </Stack>

      <LexioDivinas
        fetchOptions={{
          userId: userData?.user._id,
        }}
      />
    </>
  );
};

export default UserId;
