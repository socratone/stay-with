import useAuth from 'hooks/context/useAuth';
import { postLogin } from 'libs/axios/apis';
import { useRouter } from 'next/router';
import { ApiLoginErrorData } from 'pages/api/login';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const getGoogleAccessToken = (path: string) => {
  const index = path.indexOf('access_token=');
  if (index === -1) return '';
  const accessTokenIndex = index + 13;
  return path.substring(accessTokenIndex).split('&')[0];
};

const useGoogleLoginRedirect = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { login } = useAuth();

  const [isError, setIsError] = useState(false);

  useEffect(() => {
    (async () => {
      // 구글 인증 이후 query로 받은 access_token을 가져옴
      const googleAccessToken = getGoogleAccessToken(router.asPath);

      try {
        const { accessToken } = await postLogin(googleAccessToken);

        login(accessToken);

        router.push('/');
      } catch (error: any) {
        const status = error?.response?.status;
        const googleUser: ApiLoginErrorData['googleUser'] =
          error?.response?.data?.googleUser;

        // 앱에 아이디를 생성하지 않은 경우 -> 구글 기본 정보를 포함하여 아이디 생성 페이지로 이동
        if (status === 401 && googleUser) {
          router.push(
            `/signup?google_access_token=${googleAccessToken}&google_id=${googleUser.id}&email=${googleUser.email}&picture=${googleUser.picture}`
          );
        } else {
          setIsError(true);
        }
      }
    })();
  }, [dispatch, router, login]);

  return { isError };
};

export default useGoogleLoginRedirect;
