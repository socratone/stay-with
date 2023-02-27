import jwt from 'jsonwebtoken';
import { NextApiResponse } from 'next';

export type ApiErrorData = {
  message: string;
};

export const AUTH_SECRET = process.env.AUTH_SECRET as string;

export const isLoggedIn = (accessToken?: string) => {
  try {
    jwt.verify(accessToken ?? '', AUTH_SECRET);
    return true;
  } catch (error: any) {
    console.error(error);
    return false;
  }
};
