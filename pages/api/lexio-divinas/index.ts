import { InsertOneResult, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import Database, { CollectionName } from 'server/database';
import { LexioDivina, User } from 'types/interfaces';
import { ApiErrorData, isLoggedIn } from 'utils/api';

export type ApiLexioDivinaPayload = Omit<LexioDivina, '_id'>;

export type ApiLexioDivinasData = {
  lexioDivinas: (LexioDivina & { user: User })[];
  total: number;
};

export type ApiLexioDivinaResultData = InsertOneResult<Document>;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<
    ApiLexioDivinasData | ApiLexioDivinaResultData | ApiErrorData
  >
) => {
  if (req.method === 'GET') {
    const db = new Database();
    const offset = req.query.offset
      ? (Number(req.query.offset) - 1) * Number(req.query.count)
      : 0;
    const count = req.query.count ? Number(req.query.count) : 10;
    const userId = req.query.userId ? String(req.query.userId) : null;

    const pipeline: any[] = [
      {
        $lookup: {
          from: CollectionName.Users,
          let: {
            searchId: {
              $toObjectId: '$userId',
            },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$searchId'],
                },
              },
            },
          ],
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        // TODO: 이게 가능한지 확인해야 함
        $sort: {
          _id: -1,
        },
      },
      {
        $skip: offset,
      },
      {
        $limit: count,
      },
    ];

    if (userId) {
      pipeline.unshift({ $match: { userId: new ObjectId(userId) } });
    }

    try {
      // https://stackoverflow.com/questions/69978663/get-data-from-another-collection-string-objectid
      const lexioDivinas = await db.aggregate<
        ApiLexioDivinasData['lexioDivinas']
      >(CollectionName.LexioDivinas, pipeline);

      let total = 0;

      if (userId) {
        total = await db.find(CollectionName.LexioDivinas, {
          filter: { userId: new ObjectId(userId) },
        });
      }

      total = await db.count(CollectionName.LexioDivinas);

      db.close();
      return res.status(200).json({ lexioDivinas, total });
    } catch (error) {
      const { status, message } = Database.parseError(error);
      return res.status(status).send({ message });
    }
  }

  if (req.method === 'POST') {
    const accessToken = req.headers.authorization;

    if (!isLoggedIn(accessToken)) {
      return res.status(401).json({
        message: 'Unauthorized.',
      });
    }

    try {
      const db = new Database();
      const userId = req.body.userId;
      const result = await db.insertOne(CollectionName.LexioDivinas, {
        ...req.body,
        userId: new ObjectId(userId),
      });
      db.close();
      return res.status(201).json(result);
    } catch (error) {
      const { status, message } = Database.parseError(error);
      return res.status(status).send({ message });
    }
  }
};

export default handler;
