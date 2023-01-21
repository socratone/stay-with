import { NextApiRequest, NextApiResponse } from 'next';
import jwtDecode from 'jwt-decode';
import { ApiErrorData, isLoggedIn, responseUnknownError } from 'utils/api';
import { deletePost, getPost, updatePost } from 'libs/firebase/apis';
import { Post, User } from 'libs/firebase/interfaces';

export type ApiPostIdPayload = Omit<
  Post,
  'id' | 'user' | 'createdAt' | 'likedUsers' | 'comments'
>;

export type ApiPostIdData = Omit<Post, 'id'>;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiPostIdData | ApiErrorData>
) => {
  const id = String(req.query.id);

  if (req.method === 'GET') {
    try {
      const post = await getPost(id);
      return res.status(200).json(post);
    } catch {
      return responseUnknownError(res);
    }
  }

  const payload: ApiPostIdPayload = req.body;
  const accessToken = req.headers.authorization;

  if (!isLoggedIn(accessToken)) {
    return res.status(401).json({
      message: 'Unauthorized.',
    });
  }

  try {
    const user: User = jwtDecode(accessToken as string);
    const post = await getPost(id);

    if (user.id !== post.user.id) {
      return res.status(400).send({
        message: 'Not the author.',
      });
    }
  } catch {
    return responseUnknownError(res);
  }

  if (req.method === 'PUT') {
    try {
      await updatePost(id, payload);
      return res.status(200).end();
    } catch {
      return responseUnknownError(res);
    }
  }

  if (req.method === 'DELETE') {
    try {
      await deletePost(id);
      return res.status(200).end();
    } catch {
      return responseUnknownError(res);
    }
  }
};

export default handler;
