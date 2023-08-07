import jwt from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';
import { User } from 'schemas';

export const blockNotLoggedIn = (accessToken?: string) => {
  try {
    jwt.verify(accessToken ?? '', process.env.AUTH_SECRET as string);
  } catch {
    throw new Error('Unauthorized.');
  }
};

export const isMyId = (id: string, accessToken?: string) => {
  const user: User = jwtDecode(accessToken ?? '');
  return id === user._id;
};
