import { CollectionName } from 'constants/mongodb';
import { Document, InsertOneResult, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { Arrow, arrowPostSchema, User } from 'schemas';
import { blockNotLoggedIn } from 'utils/auth';
import { sendServerError, ServerError } from 'utils/error';
import Mongodb from 'utils/mongodb';

export type ArrowsData = {
  arrows: (Arrow & {
    user: Omit<User, 'kakaoId' | 'email'>;
    createdAt: Date;
  })[];
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
      {
        // 민감한 정보 제거
        $project: {
          user: {
            kakaoId: 0,
            email: 0,
          },
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

      db.close();
      return res.status(200).json({ arrows });
    } catch (error) {
      return sendServerError(res, error);
    }
  }

  if (req.method === 'POST') {
    try {
      const accessToken = req.headers.authorization;
      blockNotLoggedIn(accessToken);

      const db = new Mongodb();
      const validatedArrow = await arrowPostSchema.validate(req.body);
      const userId = req.body.userId;
      const result = await db.insertOne(CollectionName.Arrows, {
        ...validatedArrow,
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
