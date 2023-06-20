import { CollectionName } from 'constants/mongodb';
import { ObjectId, UpdateResult } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { sendServerError, ServerError } from 'utils/error';
import Mongodb from 'utils/mongodb';
import { PushSubscription } from 'web-push';

export type PushSubscriptionPostResult = UpdateResult;
export type PushSubscriptionPostPayload = {
  userId: string;
  pushSubscription: PushSubscription;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<PushSubscriptionPostResult | ServerError>
) => {
  const db = new Mongodb();
  const { userId, pushSubscription } = req.body;

  if (req.method === 'POST') {
    try {
      const result = await db.updateOne(
        CollectionName.Users,
        {
          _id: new ObjectId(userId),
        },
        {
          $set: { pushSubscription },
        }
      );

      db.close();
      return res.status(200).json(result);
    } catch (error) {
      sendServerError(res, error);
    }
  }
};

export default handler;
