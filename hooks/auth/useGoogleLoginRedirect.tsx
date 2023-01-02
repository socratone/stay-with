import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getUserByGoogleId } from '../../libs/firebase/apis';
import {
  ApiAuthAccessData,
  ApiAuthAccessPayload,
} from '../../pages/api/auth/access';
import useAuth from '../context/useAuth';

type UserInfoData = {
  email: string;
  id: string;
  picture: string;
  verified_email: boolean;
};

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
      const googleAccessToken = getGoogleAccessToken(router.asPath);

      try {
        // 오류가 발생하지 않는다면 정상적인 google 유저임을 입증
        // https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow#callinganapi
        const { data }: AxiosResponse<UserInfoData> = await axios.get(
          `https://www.googleapis.com/oauth2/v2/userinfo`,
          {
            headers: {
              Authorization: `Bearer ${googleAccessToken}`,
            },
          }
        );

        const { id: googleId, email, picture } = data;
        const user = await getUserByGoogleId(googleId);

        // 앱에 아이디를 이미 생성한 경우
        if (user) {
          const {
            data: { accessToken },
          } = await axios.post<
            any,
            AxiosResponse<ApiAuthAccessData>,
            ApiAuthAccessPayload
          >('/api/auth/access', {
            googleId,
          });

          login(accessToken, {
            id: user.id,
            googleId: user.googleId,
            email: user.email,
            name: user.name,
            image: user.image ?? '',
          });

          router.push('/');
          return;
        }

        // 아이디 생성 페이지로 이동
        router.push(
          `/signup?googleid=${googleId}&email=${email}&picture=${picture}`
        );
      } catch {
        setIsError(true);
      }
    })();
  }, [dispatch, router, login]);

  return { isError };
};

export default useGoogleLoginRedirect;
