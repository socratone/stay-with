import { MongoError } from 'mongodb';
import { NextApiResponse } from 'next';
import { ValidationError } from 'yup';

export type ServerError = {
  message: string;
};

export const sendServerError = (res: NextApiResponse, error: any) => {
  if (error instanceof MongoError) {
    return res.status(500).send({ message: error.message });
  }

  if (error instanceof ValidationError) {
    return res.status(400).send({ message: error.message });
  }

  if (error?.message === 'Unauthorized.') {
    return res.status(401).send({ message: 'Unauthorized.' });
  }

  return res.status(500).send({ message: 'Internal server error.' });
};
