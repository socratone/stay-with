import Cookies from 'js-cookie';

const ACCESS_TOKEN = 'access-token';

export const saveAccessToken = (accessToken: string) => {
  Cookies.set(ACCESS_TOKEN, accessToken, {
    expires: 1,
  });
};

export const removeAccessToken = () => {
  Cookies.remove(ACCESS_TOKEN);
};

export const getAccessToken = () => {
  return Cookies.get(ACCESS_TOKEN) ?? null;
};
