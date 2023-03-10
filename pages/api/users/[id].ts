import { CollectionName } from 'constants/mongodb';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from 'types/document';
import { ApiErrorData } from 'utils/auth';
import Mongodb from 'utils/mongodb';

export type ApiUserData = {
  user: User;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiUserData | ApiErrorData>
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
};

export default handler;
