import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import { GLOBAL_HEADER_HEIGHT } from 'components/GlobalHeader/constants';
import KakaoLoginButton from 'components/KakaoLoginButton/KakaoLoginButton';
import KakaoSdkScript from 'components/KakaoSdkScript';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';

type Error = {
  message: string;
};

const Login = () => {
  const kakaoRef = useRef<any | null>(null);
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

  const handleScriptReady = () => {
    const { Kakao }: any = window;
    Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY);
    kakaoRef.current = Kakao;
  };

  const handleKakaoLoginClick = () => {
    if (kakaoRef.current?.Auth) {
      kakaoRef.current.Auth.authorize({
        redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/login/redirect`,
      });

      setIsRequested(true);
    } else {
      enqueueSnackbar(
        'Kakao SDK를 불러오는 중에 에러가 발생하여 로그인을 할 수 없습니다. 새로고침을 해주세요.',
        {
          variant: 'error',
        }
      );
    }
  };

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
    <>
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
            onClick={handleKakaoLoginClick}
          />
        </Box>
      </Box>

      <KakaoSdkScript onReady={handleScriptReady} />
    </>
  );
};

export default Login;
