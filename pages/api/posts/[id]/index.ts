import { NextApiRequest, NextApiResponse } from 'next';
import jwtDecode from 'jwt-decode';
import { ApiErrorData, isLoggedIn } from 'utils/api';
import { Post, User } from 'types/interfaces';
import Database from 'server/database';
import { CollectionName } from 'server/database';
import { DeleteResult, ObjectId } from 'mongodb';
import { UpdateResult } from 'mongodb';

export type ApiPutPostPayload = Omit<
  Post,
  '_id' | 'userId' | 'createdAt' | 'likedUserIds' | 'comments'
>;

// TODO: & 순서에 따라 어떻게 달라지는지 공부
export type ApiGetPostData = {
  comments: {
    _id: string;
    user: User;
    message: string;
    createdAt: number;
  }[];
} & Post;

type ApiPutResultData = UpdateResult;

type ApiDeleteResultData = DeleteResult;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<
    ApiGetPostData | ApiPutResultData | ApiDeleteResultData | ApiErrorData
  >
) => {
  const id = String(req.query.id);
  const db = new Database();

  if (req.method === 'GET') {
    try {
      // FIXME: any type
      const [post] = await db.aggregate<any[]>(CollectionName.Posts, [
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        {
          $addFields: {
            commentUserIds: {
              $map: {
                input: '$comments',
                as: 'comment',
                in: '$$comment.userId',
              },
            },
          },
        },
        // https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/#use--lookup-with-an-array
        {
          $lookup: {
            from: CollectionName.Users,
            localField: 'commentUserIds',
            foreignField: '_id',
            as: 'commentUsers',
          },
        },
      ]);

      if (!post) {
        return res.status(404).json({ message: 'Not found.' });
      }

      const commentUsers = post.commentUsers;
      const commentUsersObject = commentUsers.reduce(
        // FIXME: any type
        (object: any, user: any) => {
          return {
            ...object,
            [user._id]: {
              name: user.name,
              image: user.image,
            },
          };
        },
        {}
      );

      const comments = post.comments.map((comment: any) => {
        const user = commentUsersObject[comment.userId];
        return {
          _id: comment._id,
          userId: comment.userId,
          name: user.name,
          image: user.image,
          message: comment.message,
        };
      });

      const editedPost = { ...post, comments };

      return res.status(200).json(editedPost);
    } catch (error) {
      const { status, message } = db.parseError(error);
      return res.status(status).send({ message });
    }
  }

  const payload: ApiPutPostPayload = req.body;
  const accessToken = req.headers.authorization;

  if (!isLoggedIn(accessToken)) {
    return res.status(401).json({
      message: 'Unauthorized.',
    });
  }

  try {
    const user: User = jwtDecode(accessToken as string);

    const post = await db.findOne<ApiGetPostData>(CollectionName.Posts, {
      _id: new ObjectId(id),
    });

    if (!post) {
      return res.status(404).json({ message: 'Not found.' });
    }

    if (user._id !== String(post.userId)) {
      return res.status(400).json({
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
