import { CollectionName } from 'constants/mongodb';
import { Document, InsertOneResult, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { sendServerError, ServerError } from 'utils/error';
import Mongodb from 'utils/mongodb';

export type ArrowsCountData = {
  count: number;
};

export type ArrowPostResult = InsertOneResult<Document>;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ArrowsCountData | ServerError>
) => {
  if (req.method === 'GET') {
    const db = new Mongodb();
    const userId =
      typeof req.query?.userId === 'string' ? req.query.userId : null;

    const pipeline: Document[] = [
      { $match: userId ? { userId: new ObjectId(userId) } : null },
      // https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/#count-the-number-of-documents-in-a-collection
      {
        $group: {
          _id: null,
          count: { $count: {} },
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
      const [ArrowsCountData] = await db.aggregate<
        (ArrowsCountData | undefined)[]
      >(CollectionName.Arrows, filteredPipeline);

      db.close();
      return res.status(200).json({ count: ArrowsCountData?.count ?? 0 });
    } catch (error) {
      return sendServerError(res, error);
    }
  }
};

export default handler;
