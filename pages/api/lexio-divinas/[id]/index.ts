import jwtDecode from 'jwt-decode';
import { DeleteResult, ObjectId, UpdateResult } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import Database, { CollectionName } from 'server/database';
import { LexioDivina, User } from 'types/interfaces';
import { ApiErrorData, isLoggedIn } from 'utils/api';

export type ApiPutLexioDivinaPayload = Omit<
  LexioDivina,
  '_id' | 'userId' | 'likedUserIds' | 'comments'
>;

export interface ApiGetLexioDivinaData extends AggregatedLexioDivina {
  comments: {
    _id: string;
    userId: string;
    name: string;
    image: string;
    message: string;
    createdAt: Date;
  }[];
}

interface AggregatedLexioDivina extends LexioDivina {
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
    | ApiGetLexioDivinaData
    | ApiPutResultData
    | ApiDeleteResultData
    | ApiErrorData
  >
) => {
  const id = String(req.query.id);
  const db = new Database();

  if (req.method === 'GET') {
    try {
      const [lexioDivina] = await db.aggregate<AggregatedLexioDivina[]>(
        CollectionName.LexioDivinas,
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

      if (!lexioDivina) {
        return res.status(404).json({ message: 'Not found.' });
      }

      const commentUsers = lexioDivina.commentUsers;
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

      const comments = lexioDivina.comments.map((comment) => {
        const user = commentUsersObject[comment.userId];
        return {
          _id: comment._id,
          userId: comment.userId,
          name: user.name,
          image: user.image,
          message: comment.message,
          createdAt: new ObjectId(comment._id).getTimestamp(),
        };
      });

      const editedLexioDivina = { ...lexioDivina, comments };

      return res.status(200).json(editedLexioDivina);
    } catch (error) {
      const { status, message } = db.parseError(error);
      return res.status(status).send({ message });
    }
  }

  const payload: ApiPutLexioDivinaPayload = req.body;
  const accessToken = req.headers.authorization;

  if (!isLoggedIn(accessToken)) {
    return res.status(401).json({
      message: 'Unauthorized.',
    });
  }

  try {
    const user: User = jwtDecode(accessToken as string);

    const lexioDivina = await db.findOne<LexioDivina>(
      CollectionName.LexioDivinas,
      {
        _id: new ObjectId(id),
      }
    );

    if (!lexioDivina) {
      return res.status(404).json({ message: 'Not found.' });
    }

    if (user._id !== String(lexioDivina.userId)) {
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
        CollectionName.LexioDivinas,
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
      const result = await db.deleteOne(CollectionName.LexioDivinas, {
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
