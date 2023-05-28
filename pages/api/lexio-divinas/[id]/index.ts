import { CollectionName } from 'constants/mongodb';
import jwtDecode from 'jwt-decode';
import { DeleteResult, ObjectId, UpdateResult } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { LexioDivina, lexioDivinaPutSchema, User } from 'schemas';
import { blockNotLoggedIn } from 'utils/auth';
import { sendServerError, ServerError } from 'utils/error';
import Mongodb from 'utils/mongodb';

interface AggregatedLexioDivina extends LexioDivina {
  commentUserIds: string[];
  commentUsers: User[];
  comments: {
    _id: string;
    userId: string;
    name: string;
    imageUrl: string;
    message: string;
    createdAt: Date;
  }[];
}

export type LexioDivinaData = {
  lexioDivina: AggregatedLexioDivina;
};

type UsersObject = {
  [userId: string]: {
    name: string;
    imageUrl: string;
  };
};

type LexioDivinaPutResult = UpdateResult;

type LexioDivinaDeleteResult = DeleteResult;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<
    | LexioDivinaData
    | LexioDivinaPutResult
    | LexioDivinaDeleteResult
    | ServerError
  >
) => {
  const id = String(req.query.id);
  const db = new Mongodb();

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
      return res.status(200).json({ lexioDivina: editedLexioDivina });
    } catch (error) {
      sendServerError(res, error);
    }
  }

  try {
    const accessToken = req.headers.authorization;
    blockNotLoggedIn(accessToken);

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
    sendServerError(res, error);
  }

  if (req.method === 'PUT') {
    try {
      const validatedLexioDivina = await lexioDivinaPutSchema.validate(
        req.body
      );
      const result = await db.updateOne(
        CollectionName.LexioDivinas,
        {
          _id: new ObjectId(id),
        },
        {
          $set: validatedLexioDivina,
        }
      );

      db.close();
      return res.status(200).json(result);
    } catch (error) {
      return sendServerError(res, error);
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
      return sendServerError(res, error);
    }
  }
};

export default handler;
