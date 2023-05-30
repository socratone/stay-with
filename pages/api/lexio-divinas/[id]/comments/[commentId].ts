import { CollectionName } from 'constants/mongodb';
import { ObjectId, UpdateResult } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { LexioDivina } from 'schemas';
import { blockNotLoggedIn } from 'utils/auth';
import { sendServerError, ServerError } from 'utils/error';
import Mongodb from 'utils/mongodb';

type CommentDeleteResult = UpdateResult;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<CommentDeleteResult | ServerError>
) => {
  const id = String(req.query.id);
  const commentId = String(req.query.commentId);

  if (req.method === 'DELETE') {
    try {
      const accessToken = req.headers.authorization;
      blockNotLoggedIn(accessToken);

      const db = new Mongodb();
      const lexioDivina = await db.findOne<LexioDivina>(
        CollectionName.LexioDivinas,
        {
          _id: new ObjectId(id),
        }
      );

      if (!lexioDivina) {
        db.close();
        return res.status(404).json({ error: { message: 'Not found.' } });
      }

      const comment = lexioDivina.comments.find(
        (comment) => String(comment._id) === commentId
      );

      const result = await db.updateOne(
        CollectionName.LexioDivinas,
        { _id: new ObjectId(id) },
        {
          $pull: { comments: comment },
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
