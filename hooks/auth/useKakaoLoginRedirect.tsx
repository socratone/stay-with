import * as Sentry from '@sentry/nextjs';
import { postLoginWithKakao } from 'helpers/axios';
import useAuth from 'hooks/auth/useAuth';
import { useRouter } from 'next/router';
import { enqueueSnackbar } from 'notistack';
import { KakaoLoginError } from 'pages/api/login/kakao';
import { useEffect, useRef, useState } from 'react';

const useKakaoLoginRedirect = (code: string) => {
  const router = useRouter();
  const { login } = useAuth();
  const [isError, setIsError] = useState(false);
  const isRequestedRef = useRef(false);

  useEffect(() => {
    (async () => {
      if (isRequestedRef.current) return;

      try {
        isRequestedRef.current = true;
        const { accessToken } = await postLoginWithKakao(code);
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
        setIsError(true);

        if (status === 400) {
          router.push('/');
          enqueueSnackbar(
            '카카오 로그인 요청 중에 에러가 발생했어요 😭 새로 고침 후 다시 시도해 주세요',
            {
              variant: 'error',
            }
          );
        }
      }
    })();
  }, [code, login, router]);

  return { isError };
};

export default useKakaoLoginRedirect;
