import { CollectionName } from 'constants/mongodb';
import { ObjectId, UpdateResult } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { LexioDivinaComment } from 'types/document';
import { isLoggedIn } from 'utils/auth';
import { ServerError } from 'utils/error';
import Mongodb from 'utils/mongodb';

export type LexioDivinaCommentPostPayload = Omit<LexioDivinaComment, '_id'>;

type ApiCommentResultData = UpdateResult;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiCommentResultData | ServerError>
) => {
  const id = String(req.query.id);
  const payload: LexioDivinaCommentPostPayload = req.body;

  if (req.method === 'POST') {
    const accessToken = req.headers.authorization;

    if (!isLoggedIn(accessToken)) {
      return res.status(401).json({
        message: 'Unauthorized.',
      });
    }

    const db = new Mongodb();

    try {
      const result = await db.updateOne(
        CollectionName.LexioDivinas,
        { _id: new ObjectId(id) },
        {
          // https://www.mongodb.com/docs/manual/reference/operator/update/addToSet/
          $addToSet: {
            comments: {
              _id: new ObjectId(),
              userId: new ObjectId(payload.userId),
              message: payload.message,
            },
          },
        }
      );

      db.close();
      return res.status(201).json(result);
    } catch (error) {
      const { status, message } = Mongodb.parseError(error);
      return res.status(status).send({ message });
    }
  }
};

export default handler;
