import { NextApiRequest, NextApiResponse } from 'next';
import jwtDecode from 'jwt-decode';
import { ApiErrorData, isLoggedIn } from 'utils/api';
import { Post, User } from 'libs/firebase/interfaces';
import Database from 'server/database';
import { CollectionName } from 'server/database';
import { DeleteResult, ObjectId } from 'mongodb';
import { UpdateResult } from 'mongodb';

export type ApiPostIdPayload = Omit<
  Post,
  '_id' | 'user' | 'createdAt' | 'likedUsers' | 'comments'
>;

export type ApiPostIdData = Omit<Post, '_id'>;

type ApiPutResultData = UpdateResult;

type ApiDeleteResultData = DeleteResult;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<
    ApiPostIdData | ApiPutResultData | ApiDeleteResultData | ApiErrorData
  >
) => {
  const id = String(req.query.id);
  const db = new Database();

  if (req.method === 'GET') {
    try {
      const post = await db.findOne<ApiPostIdData>(CollectionName.Posts, {
        _id: new ObjectId(id),
      });

      if (!post) {
        return res.status(404).json({ message: 'Not found.' });
      }

      return res.status(200).json(post);
    } catch (error) {
      const { status, message } = db.parseError(error);
      return res.status(status).send({ message });
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

    const post = await db.findOne<ApiPostIdData>(CollectionName.Posts, {
      _id: new ObjectId(id),
    });

    if (!post) {
      return res.status(404).json({ message: 'Not found.' });
    }

    if (user._id !== post.user._id) {
      return res.status(400).send({
        message: 'Not the author.',
      });
    }
  } catch (error: any) {
    if (error?.name === 'InvalidTokenError') {
      return res.status(500).json({ message: 'Invalid token error.' });
    }

    const { status, message } = db.parseError(error);
    return res.status(status).send({ message });
  }

  if (req.method === 'PUT') {
    try {
      const result = await db.updateOne(
        CollectionName.Posts,
        {
          _id: new ObjectId(id),
        },
        {
          $set: payload,
        }
      );
      return res.status(200).json(result);
    } catch (error) {
      const { status, message } = db.parseError(error);
      return res.status(status).send({ message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const result = await db.deleteOne(CollectionName.Posts, {
        _id: new ObjectId(id),
      });
      return res.status(200).json(result);
    } catch (error) {
      const { status, message } = db.parseError(error);
      return res.status(status).send({ message });
    }
  }
};

export default handler;
