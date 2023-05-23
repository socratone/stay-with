import { CollectionName } from 'constants/mongodb';
import jwtDecode from 'jwt-decode';
import { DeleteResult, ObjectId, UpdateResult } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from 'schemas';
import { LexioDivina } from 'types/document';
import { ApiErrorData, isLoggedIn } from 'utils/auth';
import Mongodb from 'utils/mongodb';

export type LexioDivinaPutPayload = Omit<
  LexioDivina,
  '_id' | 'userId' | 'likedUserIds' | 'comments'
>;

export interface LexioDivinaData extends AggregatedLexioDivina {
  comments: {
    _id: string;
    userId: string;
    name: string;
    imageUrl: string;
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
    imageUrl: string;
  };
};

type ApiPutResultData = UpdateResult;

type ApiDeleteResultData = DeleteResult;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<
    LexioDivinaData | ApiPutResultData | ApiDeleteResultData | ApiErrorData
  >
) => {
  const id = String(req.query.id);

  if (req.method === 'GET') {
    const db = new Mongodb();

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
        db.close();
        return res.status(404).json({ message: 'Not found.' });
      }

      const commentUsers = lexioDivina.commentUsers;
      const commentUsersObject: UsersObject = commentUsers.reduce(
        (object, user) => {
          return {
            ...object,
            [user._id]: {
              name: user.name,
              imageUrl: user.imageUrl,
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
          imageUrl: user.imageUrl,
          message: comment.message,
          createdAt: new ObjectId(comment._id).getTimestamp(),
        };
      });

      const editedLexioDivina = { ...lexioDivina, comments };

      db.close();
      return res.status(200).json(editedLexioDivina);
    } catch (error) {
      const { status, message } = Mongodb.parseError(error);
      return res.status(status).send({ message });
    }
  }

  const payload: LexioDivinaPutPayload = req.body;
  const accessToken = req.headers.authorization;

  if (!isLoggedIn(accessToken)) {
    return res.status(401).json({
      message: 'Unauthorized.',
    });
  }

  const db = new Mongodb();

  try {
    const user: User = jwtDecode(accessToken as string);

    const lexioDivina = await db.findOne<LexioDivina>(
      CollectionName.LexioDivinas,
      {
        _id: new ObjectId(id),
      }
    );

    if (!lexioDivina) {
      db.close();
      return res.status(404).json({ message: 'Not found.' });
    }

    if (user._id !== String(lexioDivina.userId)) {
      db.close();
      return res.status(400).json({
        message: 'Not the author.',
      });
    }
  } catch (error: any) {
    if (error?.name === 'InvalidTokenError') {
      return res.status(500).json({ message: 'Invalid token error.' });
    }

    const { status, message } = Mongodb.parseError(error);
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

      db.close();
      return res.status(200).json(result);
    } catch (error) {
      const { status, message } = Mongodb.parseError(error);
      return res.status(status).send({ message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const result = await db.deleteOne(CollectionName.LexioDivinas, {
        _id: new ObjectId(id),
      });
      db.close();
      return res.status(200).json(result);
    } catch (error) {
      const { status, message } = Mongodb.parseError(error);
      return res.status(status).send({ message });
    }
  }
};

export default handler;
