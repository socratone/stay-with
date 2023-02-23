import { NextApiRequest, NextApiResponse } from 'next';
import { ApiErrorData, isLoggedIn } from 'utils/api';
import { Comment } from 'types/interfaces';
import Database from 'server/database';
import { CollectionName } from 'server/database';
import { ObjectId, UpdateResult } from 'mongodb';

export type ApiCommentPayload = Omit<Comment, '_id'>;

type ApiCommentResultData = UpdateResult;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiCommentResultData | ApiErrorData>
) => {
  const id = String(req.query.id);
  const payload: ApiCommentPayload = req.body;

  if (req.method === 'POST') {
    const accessToken = req.headers.authorization;

    if (!isLoggedIn(accessToken)) {
      return res.status(401).json({
        message: 'Unauthorized.',
      });
    }

    const db = new Database();

    try {
      const result = await db.updateOne(
        CollectionName.Posts,
        { _id: new ObjectId(id) },
        {
          // https://www.mongodb.com/docs/manual/reference/operator/update/addToSet/
          $addToSet: {
            comments: {
              _id: new ObjectId(),
              userId: new ObjectId(payload.userId),
              message: payload.message,
              createdAt: payload.createdAt,
            },
          },
        }
      );
      return res.status(201).json(result);
    } catch (error) {
      const { status, message } = db.parseError(error);
      return res.status(status).send({ message });
    }
  }
};

export default handler;
