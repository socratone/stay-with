import { Box, Button } from '@mui/material';
import GlobalHeader from '../components/GlobalHeader';
import { signIn } from 'next-auth/react';

const Login = () => {
  const handleSignIn = () => {
    signIn('kakao', {
      callbackUrl: '/signup',
    });
  };

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <GlobalHeader />
      <Box
        flexGrow={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Button variant="outlined" onClick={handleSignIn}>
          카카오로 로그인하기
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
