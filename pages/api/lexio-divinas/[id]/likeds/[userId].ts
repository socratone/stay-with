import { ObjectId, UpdateResult } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import Database, { CollectionName } from 'server/database';
import { ApiErrorData, isLoggedIn } from 'utils/api';

type ApiDeleteLikedResultData = UpdateResult;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiDeleteLikedResultData | ApiErrorData>
) => {
  const id = String(req.query.id);
  const userId = String(req.query.userId);

  const accessToken = req.headers.authorization;

  if (!isLoggedIn(accessToken)) {
    return res.status(401).json({
      message: 'Unauthorized.',
    });
  }

  if (req.method === 'DELETE') {
    const db = new Database();

    try {
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
      const { status, message } = Database.parseError(error);
      return res.status(status).send({ message });
    }
  }
};

export default handler;
