import { CollectionName } from 'constants/mongodb';
import jwtDecode from 'jwt-decode';
import { DeleteResult, ObjectId, UpdateResult } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { LexioDivina, lexioDivinaPutSchema, User } from 'schemas';
import { blockNotLoggedIn } from 'utils/auth';
import { sendServerError, ServerError } from 'utils/error';
import Mongodb from 'utils/mongodb';

interface AggregatedLexioDivina extends LexioDivina {
  createdAt: Date;
  user: Omit<User, 'kakaoId' | 'email'>;
}

export type LexioDivinaData = {
  lexioDivina: AggregatedLexioDivina;
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
              createdAt: { $toDate: '$_id' },
            },
          },
          // user 정보 가져오기
          {
            $lookup: {
              from: CollectionName.Users,
              localField: 'userId',
              foreignField: '_id',
              as: 'user',
              pipeline: [
                // 민감한 정보 제거
                {
                  $project: {
                    kakaoId: 0,
                    email: 0,
                  },
                },
              ],
            },
          },
          {
            $unwind: '$user',
          },
        ]
      );

      if (!lexioDivina) {
        db.close();
        return res.status(404).json({ error: { message: 'Not found.' } });
      }

      db.close();
      return res.status(200).json({ lexioDivina });
    } catch (error: any) {
      // _id의 length가 규격에 안 맞는 경우
      if (error?.name === 'BSONError') {
        return res.status(404).json({ error: { message: 'Not found.' } });
      }

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
      return res.status(404).json({ error: { message: 'Not found.' } });
    }

    if (user._id !== String(lexioDivina.userId)) {
      db.close();
      return res.status(400).json({
        error: { message: 'Not the author.' },
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
