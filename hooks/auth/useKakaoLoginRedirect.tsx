import * as Sentry from '@sentry/nextjs';
import { postLoginWithKakao } from 'helpers/axios';
import useAuth from 'hooks/auth/useAuth';
import { useRouter } from 'next/router';
import { KakaoLoginError } from 'pages/api/login/kakao';
import { useEffect, useRef, useState } from 'react';
import { postKakaoOAuthToken } from 'utils/kakao';

type LoginError = {
  type: 'o-auth-token' | 'login-with-kakao';
  code: number | string;
  message: string;
};

const useKakaoLoginRedirect = (code: string) => {
  const router = useRouter();
  const { login } = useAuth();
  const isRequestedRef = useRef(false);
  const [error, setError] = useState<LoginError | null>(null);

  useEffect(() => {
    (async () => {
      if (isRequestedRef.current) return;
      isRequestedRef.current = true;

      let kakaoAccessToken = '';

      try {
        const { data } = await postKakaoOAuthToken(code);
        kakaoAccessToken = data.access_token;
      } catch (error: any) {
        Sentry.captureException(error);
        const code = error?.response?.data?.error_code;
        const message = error?.response?.data?.error_description;
        setError({
          type: 'o-auth-token',
          code,
          message,
        });
        return;
      }

      try {
        const { accessToken } = await postLoginWithKakao(kakaoAccessToken);
        login(accessToken);
        router.replace('/');
      } catch (error: any) {
        const status = error?.response?.status;
        const kakaoUser: KakaoLoginError['error']['kakaoUser'] =
          error?.response?.data?.error.kakaoUser;

        // 앱에 아이디를 생성하지 않은 경우 -> 카카오 기본 정보를 포함하여 아이디 생성 페이지로 이동
        if (status === 401 && kakaoUser) {
          router.push(
            `/signup?kakao_id=${kakaoUser.id}&email=${kakaoUser.kakao_account.email}&image_url=${kakaoUser.kakao_account.profile.profile_image_url}`
          );
          return;
        }

        Sentry.captureException(error);
        const code = error?.response?.data?.error?.code;
        const message = error?.response?.data?.error?.message;
        setError({
          type: 'login-with-kakao',
          code,
          message,
        });
      }
    })();
  }, [code, login, router]);

  return { error };
};

export default useKakaoLoginRedirect;
