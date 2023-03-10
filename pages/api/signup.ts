import { InsertOneResult } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import Database, { CollectionName } from 'server/database';
import { User } from 'types/interfaces';
import { ApiErrorData } from 'utils/auth';

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
      db.close();
      return res.status(201).json(result);
    } catch (error) {
      const { status, message } = Database.parseError(error);
      return res.status(status).send({ message });
    }
  }
};

export default handler;
