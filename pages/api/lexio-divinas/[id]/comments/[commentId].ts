import { CollectionName } from 'constants/mongodb';
import { ObjectId, UpdateResult } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { LexioDivina } from 'types/interfaces';
import { ApiErrorData, isLoggedIn } from 'utils/auth';
import Mongodb from 'utils/mongodb';

type ApiDeleteCommentResultData = UpdateResult;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiDeleteCommentResultData | ApiErrorData>
) => {
  const id = String(req.query.id);
  const commentId = String(req.query.commentId);
  const accessToken = req.headers.authorization;

  if (!isLoggedIn(accessToken)) {
    return res.status(401).json({
      message: 'Unauthorized.',
    });
  }

  const db = new Mongodb();

  if (req.method === 'DELETE') {
    try {
      const lexioDivina = await db.findOne<LexioDivina>(
        CollectionName.LexioDivinas,
        {
          _id: new ObjectId(id),
        }
      );

      if (!lexioDivina) {
        db.close();
        return res.status(404).json({ message: 'Not found.' });
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
      const { status, message } = Mongodb.parseError(error);
      return res.status(status).send({ message });
    }
  }
};

export default handler;
