import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { GLOBAL_HEADER_HEIGHT } from 'components/GlobalHeader/constants';
import KakaoLoginButton from 'components/KakaoLoginButton';
import { useState } from 'react';

const Login = () => {
  const [isRequested, setIsRequested] = useState(false);

  return (
    <Box
      height={`calc(100vh - ${GLOBAL_HEADER_HEIGHT})`}
      display="flex"
      flexDirection="column"
    >
      <Box
        flexGrow={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={1}
        p={2}
      >
        <Typography color="text.primary" textAlign="center">
          {isRequested
            ? '카카오 로그인을 시도중입니다 🥰'
            : '서비스를 이용하려면 카카오 계정이 필요해요 🙂'}
        </Typography>
        <KakaoLoginButton
          disabled={isRequested}
          onClick={() => setIsRequested(true)}
        />
      </Box>
    </Box>
  );
};

export default Login;
