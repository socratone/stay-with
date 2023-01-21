import { NextApiRequest, NextApiResponse } from 'next';
import { deleteCommentInPost } from 'libs/firebase/apis';
import { ApiErrorData, isLoggedIn, responseUnknownError } from 'utils/api';
import { Comment } from 'libs/firebase/interfaces';

export type ApiDeleteCommentPayload = Comment;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiErrorData>
) => {
  const id = String(req.query.id);
  const commentId = String(req.query.commentId);
  const accessToken = req.headers.authorization;

  if (!isLoggedIn(accessToken)) {
    return res.status(401).json({
      message: 'Unauthorized.',
    });
  }

  if (req.method === 'DELETE') {
    try {
      await deleteCommentInPost(id, commentId);
      return res.status(200).end();
    } catch {
      return responseUnknownError(res);
    }
  }
};

export default handler;
