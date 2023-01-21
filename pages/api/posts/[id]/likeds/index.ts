import { NextApiRequest, NextApiResponse } from 'next';
import { ApiErrorData, isLoggedIn, responseUnknownError } from 'utils/api';
import { User } from 'libs/firebase/interfaces';
import { addLikedToPost } from 'libs/firebase/apis';

export type ApiLikedPayload = User;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiErrorData>
) => {
  const id = String(req.query.id);
  const payload: ApiLikedPayload = req.body;

  if (req.method === 'POST') {
    const accessToken = req.headers.authorization;

    if (!isLoggedIn(accessToken)) {
      return res.status(401).json({
        message: 'Unauthorized.',
      });
    }

    try {
      await addLikedToPost(id, payload);
      return res.status(201).end();
    } catch {
      return responseUnknownError(res);
    }
  }
};

export default handler;
