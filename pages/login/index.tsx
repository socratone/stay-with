import { Box, Button, Typography } from '@mui/material';
import GlobalHeader from 'components/GlobalHeader';

const Login = () => {
  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <GlobalHeader />
      <Box
        flexGrow={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={1}
      >
        <Typography
          color="text.primary"
          textAlign="center"
          sx={{ whiteSpace: 'pre-line' }}
        >
          {'현재 구글 계정을 이용한\n로그인만 가능합니다 🤗'}
        </Typography>
        <Button
          variant="outlined"
          href={`https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}/login/redirect&client_id=${process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID}&response_type=token&scope=https://www.googleapis.com/auth/userinfo.email`}
        >
          구글로 로그인하기
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
