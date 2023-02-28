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
  const db = new Database();

  if (req.method === 'GET') {
    const offset = req.query.offset;
    const count = req.query.count;

    try {
      // https://stackoverflow.com/questions/69978663/get-data-from-another-collection-string-objectid
      const lexioDivinas = await db.aggregate<
        ApiLexioDivinasData['lexioDivinas']
      >(CollectionName.LexioDivinas, [
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
          $sort: {
            createdAt: -1,
          },
        },
        {
          $skip: offset
            ? (Number(req.query.offset) - 1) * Number(req.query.count)
            : 0,
        },
        {
          $limit: count ? Number(req.query.count) : 10,
        },
      ]);

      const total = await db.count(CollectionName.LexioDivinas);
      return res.status(200).json({ lexioDivinas, total });
    } catch (error) {
      const { status, message } = db.parseError(error);
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
      const userId = req.body.userId;
      const result = await db.insertOne(CollectionName.LexioDivinas, {
        ...req.body,
        userId: new ObjectId(userId),
      });
      return res.status(201).json(result);
    } catch (error) {
      const { status, message } = db.parseError(error);
      return res.status(status).send({ message });
    }
  }
};

export default handler;
