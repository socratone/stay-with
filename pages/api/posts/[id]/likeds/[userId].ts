import { NextApiRequest, NextApiResponse } from 'next';
import { ApiErrorData, isLoggedIn } from 'utils/api';
import Database, { CollectionName } from 'server/database';
import { ObjectId, UpdateResult } from 'mongodb';

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
        CollectionName.Posts,
        { _id: new ObjectId(id) },
        {
          // https://www.mongodb.com/docs/manual/reference/operator/update/pull/#-pull
          $pull: {
            likedUserIds: new ObjectId(userId),
          },
        }
      );
      return res.status(200).json(result);
    } catch (error) {
      const { status, message } = db.parseError(error);
      return res.status(status).send({ message });
    }
  }
};

export default handler;
