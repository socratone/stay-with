import { CollectionName } from 'constants/mongodb';
import { InsertOneResult } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { userPostSchema } from 'schemas';
import { sendServerError, ServerError } from 'utils/error';
import Mongodb from 'utils/mongodb';

export type UserPostResult = InsertOneResult<Document>;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<UserPostResult | ServerError>
) => {
  const db = new Mongodb();

  if (req.method === 'POST') {
    try {
      const validatedUser = await userPostSchema.validate(req.body);

      const duplicateNameUser = await db.findOne(CollectionName.Users, {
        name: validatedUser.name,
      });

      if (duplicateNameUser) {
        return res.status(409).send({ error: { message: 'Duplicate name.' } });
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
