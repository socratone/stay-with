import jwt from 'jsonwebtoken';

export const isLoggedIn = (accessToken?: string) => {
  try {
    jwt.verify(accessToken ?? '', process.env.AUTH_SECRET as string);
    return true;
  } catch {
    return false;
  }
};
