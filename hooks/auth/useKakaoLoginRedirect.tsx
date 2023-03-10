import { postLoginWithKakao } from 'helpers/axios';
import useAuth from 'hooks/context/useAuth';
import { useRouter } from 'next/router';
import { ApiLoginKakaoErrorData } from 'pages/api/login/kakao';
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
        const kakaoUser: ApiLoginKakaoErrorData['kakaoUser'] =
          error?.response?.data?.kakaoUser;

        // 앱에 아이디를 생성하지 않은 경우 -> 카카오 기본 정보를 포함하여 아이디 생성 페이지로 이동
        if (status === 401 && kakaoUser) {
          router.push(
            `/signup?kakao_id=${kakaoUser.id}&email=${kakaoUser.kakao_account.email}&image_url=${kakaoUser.kakao_account.profile.profile_image_url}`
          );
        } else {
          setIsError(true);
        }
      }
    })();
  }, [code, login, router]);

  return { isError };
};

export default useKakaoLoginRedirect;
