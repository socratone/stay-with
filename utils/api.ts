import { NextApiResponse } from 'next';

export type ApiErrorData = {
  message: string;
};

export const responseUnknownError = (res: NextApiResponse) => {
  res.status(500).json({
    message: 'An unknown error has occurred.',
  });
};
