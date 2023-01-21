import { NextApiRequest, NextApiResponse } from 'next';
import { ApiErrorData, isLoggedIn, responseUnknownError } from 'utils/api';
import { Comment } from 'libs/firebase/interfaces';
import { addCommentToPost } from 'libs/firebase/apis';
import { v4 as uuidv4 } from 'uuid';

export type ApiCommentPayload = Omit<Comment, 'id'>;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiErrorData>
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

    try {
      await addCommentToPost(id, { ...payload, id: uuidv4() });
      return res.status(201).end();
    } catch {
      return responseUnknownError(res);
    }
  }
};

export default handler;
