import { CollectionName } from 'constants/mongodb';
import jwtDecode from 'jwt-decode';
import { ObjectId, UpdateResult } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { blockNotLoggedIn, isMyId } from 'utils/auth';
import { sendServerError, ServerError } from 'utils/error';
import { sendCustomLog } from 'utils/log';
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
      if (!isMyId(userId, accessToken)) {
        return res.status(403).json({
          error: { message: 'Not yourself.' },
        });
      }

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

      sendCustomLog({
        message: 'Who delete like',
        metadata: {
          user: jwtDecode(accessToken ?? ''),
          accessToken,
        },
      });

      db.close();
      return res.status(200).json(result);
    } catch (error) {
      return sendServerError(res, error);
    }
  }
};

export default handler;
