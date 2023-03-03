import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import GlobalHeader from 'components/GlobalHeader';
import Script from 'next/script';
import { useRef } from 'react';

const Login = () => {
  const KakaoRef = useRef<any | null>(null);

  const handleLoad = () => {
    const { Kakao }: any = window;
    Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY);
    KakaoRef.current = Kakao;
  };

  const handleKakaoLoginClick = () => {
    if (KakaoRef.current.Auth) {
      KakaoRef.current.Auth.authorize({
        redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/login/redirect`,
      });
    }
  };

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
        onLoad={handleLoad}
      />
    </>
  );
};

export default Login;
