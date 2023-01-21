import { NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export type ApiErrorData = {
  message: string;
};

export const AUTH_SECRET = process.env.AUTH_SECRET as string;

if (!AUTH_SECRET) {
  throw new Error('AUTH_SECRET is empty.');
}

export const responseUnknownError = (res: NextApiResponse) => {
  res.status(500).json({
    message: 'An unknown error has occurred.',
  });
};

export const isLoggedIn = (accessToken?: string) => {
  try {
    jwt.verify(accessToken ?? '', AUTH_SECRET);
    return true;
  } catch (error: any) {
    console.error(error);
    return false;
  }
};
