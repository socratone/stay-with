import { NextApiResponse } from 'next';
import { ValidationError } from 'yup';

export type ServerError = {
  message: string;
};

export const sendServerError = (res: NextApiResponse, error: any) => {
  if (error instanceof ValidationError) {
    return res.status(400).send({ message: error.message });
  }

  return res.status(500).send({ message: 'Internal server error.' });
};
