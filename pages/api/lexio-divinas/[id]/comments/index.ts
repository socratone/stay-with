import { CollectionName } from 'constants/mongodb';
import { ObjectId, UpdateResult } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { lexioDivinaCommentPostSchema } from 'schemas/lexio-divina';
import { blockNotLoggedIn } from 'utils/auth';
import { sendServerError, ServerError } from 'utils/error';
import Mongodb from 'utils/mongodb';

type CommentPostResult = UpdateResult;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<CommentPostResult | ServerError>
) => {
  const id = String(req.query.id);
  const validatedComment = await lexioDivinaCommentPostSchema.validate(
    req.body
  );

  if (req.method === 'POST') {
    try {
      const accessToken = req.headers.authorization;
      blockNotLoggedIn(accessToken);

      const db = new Mongodb();
      const result = await db.updateOne(
        CollectionName.LexioDivinas,
        { _id: new ObjectId(id) },
        {
          // https://www.mongodb.com/docs/manual/reference/operator/update/addToSet/
          $addToSet: {
            comments: {
              _id: new ObjectId(),
              userId: new ObjectId(validatedComment.userId),
              message: validatedComment.message,
            },
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
