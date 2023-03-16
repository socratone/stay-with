import { CollectionName } from 'constants/mongodb';
import { InsertOneResult } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from 'types/document';
import { ApiErrorData } from 'utils/auth';
import Mongodb from 'utils/mongodb';

export type ApiSignUpPayload = Omit<User, '_id'>;

export type ApiSignUpData = InsertOneResult<Document>;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiSignUpData | ApiErrorData>
) => {
  const payload: ApiSignUpPayload = req.body;

  if (req.method === 'POST') {
    const db = new Mongodb();

    try {
      const duplicateNameUser = await db.findOne(CollectionName.Users, {
        name: payload.name,
      });

      if (duplicateNameUser) {
        return res.status(409).send({ message: 'Duplicate name.' });
      }

      const result = await db.insertOne(CollectionName.Users, req.body);
      db.close();
      return res.status(201).json(result);
    } catch (error) {
      const { status, message } = Mongodb.parseError(error);
      return res.status(status).send({ message });
    }
  }
};

export default handler;
