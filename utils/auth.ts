import jwt from 'jsonwebtoken';

export const blockNotLoggedIn = (accessToken?: string) => {
  try {
    jwt.verify(accessToken ?? '', process.env.AUTH_SECRET as string);
  } catch {
    throw new Error('Unauthorized.');
  }
};
