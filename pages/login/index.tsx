import { Box, Button } from '@mui/material';
import GlobalHeader from '../../components/GlobalHeader';

const Login = () => {
  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <GlobalHeader />
      <Box
        flexGrow={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Button
          variant="outlined"
          // TODO: .env 적용해야 함
          href={`https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http%3A//localhost:3000/login/redirect&client_id=${process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID}&response_type=token&scope=https://www.googleapis.com/auth/userinfo.email`}
        >
          구글로 로그인하기
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
