import { NextApiRequest, NextApiResponse } from 'next';
import { ApiErrorData, isLoggedIn } from 'utils/api';
import { Post } from 'types/interfaces';
import Database, { CollectionName } from 'server/database';
import { ObjectId, UpdateResult } from 'mongodb';

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

  const db = new Database();

  if (req.method === 'DELETE') {
    try {
      const post = await db.findOne<Post>(CollectionName.Posts, {
        _id: new ObjectId(id),
      });

      if (!post) {
        return res.status(404).json({ message: 'Not found.' });
      }

      const comment = post.comments.find(
        (comment) => String(comment._id) === commentId
      );

      const result = await db.updateOne(
        CollectionName.Posts,
        { _id: new ObjectId(id) },
        {
          $pull: { comments: comment },
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
