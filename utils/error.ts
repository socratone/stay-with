import { MongoError } from 'mongodb';
import { NextApiResponse } from 'next';
import { ValidationError } from 'yup';

export type ServerError = {
  error: { message: string };
};

export const sendServerError = (res: NextApiResponse, error: any) => {
  if (error?.name === 'InvalidTokenError') {
    return res.status(500).json({ error: { message: 'Invalid token error.' } });
  }

  if (error instanceof MongoError) {
    return res.status(500).send({ error: { message: error.message } });
  }

  if (error instanceof ValidationError) {
    return res.status(422).send({ error: { message: error.message } });
  }

  if (error?.message === 'Unauthorized.') {
    return res.status(401).send({ error: { message: 'Unauthorized.' } });
  }

  return res.status(500).send({ error: { message: 'Internal server error.' } });
};
