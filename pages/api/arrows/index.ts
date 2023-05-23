import { CollectionName } from 'constants/mongodb';
import { Document, InsertOneResult, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { Arrow, User } from 'schemas';
import { isLoggedIn } from 'utils/auth';
import { ServerError } from 'utils/error';
import Mongodb from 'utils/mongodb';

export type ArrowPostPayload = Omit<Arrow, '_id'>;

export type ArrowsData = {
  arrows: (Arrow & { user: User; createdAt: Date })[];
  total: number; // TODO: count api를 따로 만드는 게 좋은가?
};

export type ArrowPostResult = InsertOneResult<Document>;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ArrowsData | ArrowPostResult | ServerError>
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
      const arrows = await db.aggregate<ArrowsData['arrows']>(
        CollectionName.Arrows,
        filteredPipeline
      );

      const total = await db.count(CollectionName.Arrows);

      db.close();
      return res.status(200).json({ arrows, total });
    } catch (error) {
      const { status, message } = Mongodb.parseError(error);
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
      const db = new Mongodb();
      const userId = req.body.userId;
      const result = await db.insertOne(CollectionName.Arrows, {
        ...req.body, // TODO: 각 값 validation 처리
        userId: new ObjectId(userId),
      });
      db.close();
      return res.status(201).json(result);
    } catch (error) {
      const { status, message } = Mongodb.parseError(error);
      return res.status(status).send({ message });
    }
  }
};

export default handler;
