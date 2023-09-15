import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ErrorMessage from 'components/ErrorMessage';
import { GLOBAL_HEADER_HEIGHT } from 'components/GlobalHeader/constants';
import KakaoLoginButton from 'components/KakaoLoginButton';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Error = {
  message: string;
};

const CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
const REDIRECT_URI = encodeURI(
  `${process.env.NEXT_PUBLIC_BASE_URL}/login/redirect`
);

const Login = () => {
  const [isRequested, setIsRequested] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timer;

    if (isRequested) {
      timer = setTimeout(() => {
        setError({ message: '카카오 로그인 페이지에 이동할 수 없습니다 😂' });
      }, 10000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isRequested]);

  if (error) {
    return (
      <Box
        height={`calc(100vh - ${GLOBAL_HEADER_HEIGHT})`}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <ErrorMessage content={error.message} />
      </Box>
    );
  }

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
        <Link
          href={`https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`}
          onClick={() => setIsRequested(true)}
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <KakaoLoginButton disabled={isRequested} />
        </Link>
      </Box>
    </Box>
  );
};

export default Login;
