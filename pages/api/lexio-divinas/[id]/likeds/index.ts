import { CollectionName } from 'constants/mongodb';
import { ObjectId, UpdateResult } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { blockNotLoggedIn, isMyId } from 'utils/auth';
import { sendServerError, ServerError } from 'utils/error';
import Mongodb from 'utils/mongodb';

export type LexioDivinaLikedPostPayload = {
  userId: string;
};

type LexioDivinaLikedPostResult = UpdateResult;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<LexioDivinaLikedPostResult | ServerError>
) => {
  if (req.method === 'POST') {
    try {
      const accessToken = req.headers.authorization;
      const id = String(req.query.id);
      const { userId }: LexioDivinaLikedPostPayload = req.body;

      blockNotLoggedIn(accessToken);
      if (!isMyId(userId, accessToken)) {
        return res.status(400).json({
          error: { message: 'Not yourself.' },
        });
      }

      const db = new Mongodb();

      const result = await db.updateOne(
        CollectionName.LexioDivinas,
        { _id: new ObjectId(id) },
        {
          // https://www.mongodb.com/docs/manual/reference/operator/update/addToSet/
          $addToSet: {
            likedUserIds: new ObjectId(userId),
          },
        }
      );

      db.close();
      return res.status(201).json(result);
    } catch (error) {
      return sendServerError(res, error);
    }
  }
};

export default handler;
