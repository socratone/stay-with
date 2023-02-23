import { NextApiRequest, NextApiResponse } from 'next';
import { User } from 'types/interfaces';
import { ApiErrorData } from 'utils/api';
import Database from 'server/database';
import { CollectionName } from 'server/database';
import { InsertOneResult } from 'mongodb';

export type ApiSignUpPayload = Omit<User, '_id'>;

export type ApiSignUpData = InsertOneResult<Document>;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiSignUpData | ApiErrorData>
) => {
  if (req.method === 'POST') {
    const db = new Database();

    try {
      const result = await db.insertOne(CollectionName.Users, req.body);
      return res.status(201).json(result);
    } catch (error) {
      const { status, message } = db.parseError(error);
      return res.status(status).send({ message });
    }
  }
};

export default handler;
