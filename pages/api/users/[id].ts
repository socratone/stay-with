import { CollectionName } from 'constants/mongodb';
import jwtDecode from 'jwt-decode';
import { ObjectId, UpdateResult } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from 'types/document';
import { ApiErrorData } from 'utils/auth';
import Mongodb from 'utils/mongodb';

export type ApiUserData = {
  user: User;
};

export type ApiPatchUserPayload = {
  name?: User['name'];
};

type ApiPutResultData = UpdateResult;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiUserData | ApiErrorData | ApiPutResultData>
) => {
  const id = String(req.query.id);
  const db = new Mongodb();

  if (req.method === 'GET') {
    try {
      const user = await db.findOne<User>(CollectionName.Users, {
        _id: new ObjectId(id),
      });

      if (!user) {
        return res.status(404).json({ message: 'Not found.' });
      }

      db.close();
      return res.status(200).json({ user });
    } catch (error) {
      const { status, message } = Mongodb.parseError(error);
      return res.status(status).send({ message });
    }
  }

  if (req.method === 'PATCH') {
    const accessToken = req.headers.authorization;
    const user: User = jwtDecode(accessToken as string);

    if (id !== user._id) {
      db.close();
      return res.status(400).json({
        message: 'Not yourself.',
      });
    }

    const payload: ApiPatchUserPayload = req.body;

    try {
      const result = await db.updateOne(
        CollectionName.Users,
        {
          _id: new ObjectId(id),
        },
        {
          $set: payload,
        }
      );

      db.close();
      return res.status(200).json(result);
    } catch (error) {
      const { status, message } = Mongodb.parseError(error);
      return res.status(status).send({ message });
    }
  }
};

export default handler;
