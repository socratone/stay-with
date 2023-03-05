import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import GlobalHeader from 'components/GlobalHeader';
import WaitingMessage from 'components/WaitingMessage/WaitingMessage';
import Script from 'next/script';
import { useSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';

type Error = {
  message: string;
};

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const KakaoRef = useRef<any | null>(null);
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

  const handleScriptLoad = () => {
    const { Kakao }: any = window;
    Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY);
    KakaoRef.current = Kakao;
  };

  const handleScriptError = () => {
    enqueueSnackbar('Kakao SDK를 불러오는 중에 에러가 발생했습니다.', {
      variant: 'error',
    });
  };

  const handleKakaoLoginClick = () => {
    if (KakaoRef.current?.Auth) {
      KakaoRef.current.Auth.authorize({
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
      <>
        <GlobalHeader />
        <Box
          height="100vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <ErrorMessage content={error.message} />
        </Box>
      </>
    );
  }

  if (isRequested) {
    return (
      <>
        <GlobalHeader />
        <Box
          height="100vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <WaitingMessage content="카카오 로그인을 시도중입니다 🥰" />
        </Box>
      </>
    );
  }

  return (
    <>
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
          <Button variant="outlined" onClick={handleKakaoLoginClick}>
            카카오 아이디로 로그인하기
          </Button>
        </Box>
      </Box>

      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.1.0/kakao.min.js"
        integrity="sha384-dpu02ieKC6NUeKFoGMOKz6102CLEWi9+5RQjWSV0ikYSFFd8M3Wp2reIcquJOemx"
        crossOrigin="anonymous"
        onLoad={handleScriptLoad}
        onError={handleScriptError}
      />
    </>
  );
};

export default Login;
