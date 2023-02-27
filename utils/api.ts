import jwt from 'jsonwebtoken';

export type ApiErrorData = {
  message: string;
};

export const isLoggedIn = (accessToken?: string) => {
  try {
    jwt.verify(accessToken ?? '', process.env.AUTH_SECRET as string);
    return true;
  } catch (error: any) {
    console.error(error);
    return false;
  }
};
