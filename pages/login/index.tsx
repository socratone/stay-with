import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import GlobalHeader from 'components/GlobalHeader';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

const Login = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleCopyClick = () => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}`
    );
    enqueueSnackbar('클립보드에 현재 URL이 복사됐습니다.');
  };

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
        p={2}
      >
        <Typography
          color="text.primary"
          textAlign="center"
          sx={{ whiteSpace: 'pre-line' }}
        >
          {
            '구글의 보안 정책으로 📱 모바일은 시스템 브라우저에서만 로그인이 가능합니다.\n계속 진행하시려면 크롬이나 사파리 브라우저를 이용해서 접속해주세요. 😄'
          }
        </Typography>
        <Button onClick={handleCopyClick} startIcon={<ContentCopyIcon />}>
          현재 주소 복사하기
        </Button>
        <Button
          variant="outlined"
          href={`https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}/login/redirect&client_id=${process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID}&response_type=token&scope=https://www.googleapis.com/auth/userinfo.email`}
        >
          구글 아이디로 로그인하기
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
