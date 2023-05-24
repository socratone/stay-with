import { CollectionName } from 'constants/mongodb';
import { Document, InsertOneResult, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from 'schemas';
import { LexioDivina, lexioDivinaPostSchema } from 'schemas/lexio-divina';
import { blockNotLoggedIn } from 'utils/auth';
import { sendServerError, ServerError } from 'utils/error';
import Mongodb from 'utils/mongodb';

export type LexioDivinasData = {
  lexioDivinas: (LexioDivina & { user: User; createdAt: Date })[];
  total: number;
};

type LexioDivinaPostResult = InsertOneResult<Document>;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<LexioDivinasData | LexioDivinaPostResult | ServerError>
) => {
  if (req.method === 'GET') {
    const db = new Mongodb();
    const skip =
      typeof req.query?.skip === 'string' ? Number(req.query.skip) : null;
    const limit =
      typeof req.query?.limit === 'string' ? Number(req.query.limit) : 100; // 제한값
    const userId =
      typeof req.query?.userId === 'string' ? req.query.userId : null;

    const pipeline: Document[] = [
      { $match: userId ? { userId: new ObjectId(userId) } : null },
      {
        // https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/lookup/#syntax
        $lookup: {
          from: CollectionName.Users,
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $addFields: {
          createdAt: { $toDate: '$_id' },
        },
      },
    ];

    // value의 값이 null인 invalid한 object 제거
    const filteredPipeline = pipeline.filter((document) => {
      for (const value of Object.values(document)) {
        if (value === null) return false;
      }
      return true;
    });

    try {
      // https://stackoverflow.com/questions/69978663/get-data-from-another-collection-string-objectid
      const lexioDivinas = await db.aggregate<LexioDivinasData['lexioDivinas']>(
        CollectionName.LexioDivinas,
        filteredPipeline
      );

      let total = 0;

      // FIXME: 리소스 문제로 삭제
      if (userId) {
        const result = await db.find<any[]>(CollectionName.LexioDivinas, {
          filter: { userId: new ObjectId(userId) },
        });
        total = result.length;
      } else {
        total = await db.count(CollectionName.LexioDivinas);
      }

      db.close();
      return res.status(200).json({ lexioDivinas, total });
    } catch (error) {
      return sendServerError(res, error);
    }
  }

  if (req.method === 'POST') {
    try {
      const accessToken = req.headers.authorization;
      blockNotLoggedIn(accessToken);

      const db = new Mongodb();
      const validatedUser = await lexioDivinaPostSchema.validate(req.body);
      const userId = validatedUser.userId;
      const result = await db.insertOne(CollectionName.LexioDivinas, {
        ...validatedUser,
        userId: new ObjectId(userId),
      });

      db.close();
      return res.status(201).json(result);
    } catch (error) {
      return sendServerError(res, error);
    }
  }
};

export default handler;
