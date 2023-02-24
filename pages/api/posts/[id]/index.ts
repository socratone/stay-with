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

export interface ApiGetPostData extends AggregatedPost {
  comments: {
    _id: string;
    userId: string;
    name: string;
    image: string;
    message: string;
    createdAt: number;
  }[];
}

interface AggregatedPost extends Post {
  commentUserIds: string[];
  commentUsers: User[];
}

type UsersObject = {
  [userId: string]: {
    name: string;
    image: string;
  };
};

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
      const [post] = await db.aggregate<AggregatedPost[]>(
        CollectionName.Posts,
        [
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
        ]
      );

      if (!post) {
        return res.status(404).json({ message: 'Not found.' });
      }

      const commentUsers = post.commentUsers;
      const commentUsersObject: UsersObject = commentUsers.reduce(
        (object, user) => {
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

      const comments = post.comments.map((comment) => {
        const user = commentUsersObject[comment.userId];
        return {
          _id: comment._id,
          userId: comment.userId,
          name: user.name,
          image: user.image,
          message: comment.message,
          createdAt: comment.createdAt,
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

    const post = await db.findOne<Post>(CollectionName.Posts, {
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
