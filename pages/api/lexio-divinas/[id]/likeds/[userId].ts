import { CollectionName } from 'constants/mongodb';
import { ObjectId, UpdateResult } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { blockNotLoggedIn } from 'utils/auth';
import { sendServerError, ServerError } from 'utils/error';
import Mongodb from 'utils/mongodb';

type LexioDivinaLikedDeleteResult = UpdateResult;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<LexioDivinaLikedDeleteResult | ServerError>
) => {
  const id = String(req.query.id);
  const userId = String(req.query.userId);

  if (req.method === 'DELETE') {
    try {
      const accessToken = req.headers.authorization;
      blockNotLoggedIn(accessToken);

      const db = new Mongodb();
      const result = await db.updateOne(
        CollectionName.LexioDivinas,
        { _id: new ObjectId(id) },
        {
          // https://www.mongodb.com/docs/manual/reference/operator/update/pull/#-pull
          $pull: {
            likedUserIds: new ObjectId(userId),
          },
        }
      );

      db.close();
      return res.status(200).json(result);
    } catch (error) {
      return sendServerError(res, error);
    }
  }
};

export default handler;
