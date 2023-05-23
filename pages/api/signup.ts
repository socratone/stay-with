import { CollectionName } from 'constants/mongodb';
import { InsertOneResult } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { UserPostPayload, userPostSchema } from 'schemas/user';
import { ApiErrorData } from 'utils/auth';
import { sendServerError } from 'utils/error';
import Mongodb from 'utils/mongodb';

export type UserPostResult = InsertOneResult<Document>;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<UserPostResult | ApiErrorData>
) => {
  const db = new Mongodb();
  const payload: UserPostPayload = req.body;

  if (req.method === 'POST') {
    try {
      const validatedUser = await userPostSchema.validate(payload);

      const duplicateNameUser = await db.findOne(CollectionName.Users, {
        name: validatedUser.name,
      });

      if (duplicateNameUser) {
        return res.status(409).send({ message: 'Duplicate name.' });
      }

      const result = await db.insertOne(CollectionName.Users, validatedUser);
      db.close();
      return res.status(201).json(result);
    } catch (error) {
      sendServerError(res, error);
    }
  }
};

export default handler;
