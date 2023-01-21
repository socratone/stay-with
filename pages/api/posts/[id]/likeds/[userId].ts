import { NextApiRequest, NextApiResponse } from 'next';
import { deleteLikedInPost } from 'libs/firebase/apis';
import { ApiErrorData, isLoggedIn, responseUnknownError } from 'utils/api';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiErrorData>
) => {
  const id = String(req.query.id);
  const userId = String(req.query.userId);

  const accessToken = req.headers.authorization;

  if (!isLoggedIn(accessToken)) {
    return res.status(401).json({
      message: 'Unauthorized.',
    });
  }

  if (req.method === 'DELETE') {
    try {
      await deleteLikedInPost(id, userId);
      return res.status(200).end();
    } catch {
      return responseUnknownError(res);
    }
  }
};

export default handler;
