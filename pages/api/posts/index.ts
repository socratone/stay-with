import { NextApiRequest, NextApiResponse } from 'next';
import { addPost } from '../../../libs/firebase/apis';
import { Post } from '../../../libs/firebase/interfaces';
import {
  ApiErrorData,
  responseUnknownError,
  isLoggedIn,
} from '../../../utils/api';

export type ApiPostPayload = Omit<Post, 'id'>;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiErrorData>
) => {
  if (req.method === 'POST') {
    const accessToken = req.headers.authorization;

    if (!isLoggedIn(accessToken)) {
      return res.status(401).json({
        message: 'Unauthorized.',
      });
    }

    try {
      await addPost(req.body);
      return res.status(201).end();
    } catch {
      return responseUnknownError(res);
    }
  }
};

export default handler;
