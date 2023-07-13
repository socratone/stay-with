import { CollectionName } from 'constants/mongodb';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { Notification } from 'schemas';
import { blockNotLoggedIn } from 'utils/auth';
import { sendServerError, ServerError } from 'utils/error';
import Mongodb from 'utils/mongodb';

export type NotificationsData = { notifications: Notification[] };

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<NotificationsData | ServerError>
) => {
  if (req.method === 'GET') {
    const accessToken = req.headers.authorization;
    blockNotLoggedIn(accessToken);

    const db = new Mongodb();
    const skip =
      typeof req.query?.skip === 'string' ? Number(req.query.skip) : null;
    const limit =
      typeof req.query?.limit === 'string' ? Number(req.query.limit) : 100; // 제한값
    const userId =
      typeof req.query?.userId === 'string' ? req.query.userId : null;

    try {
      const notifications = await db.find<Notification[]>(
        CollectionName.Notifications,
        {
          filter: userId
            ? {
                userId: new ObjectId(userId),
              }
            : undefined,
          options: {
            skip: skip ?? 0,
            limit: limit ?? 100,
          },
        }
      );

      db.close();
      return res.status(200).json({ notifications });
    } catch (error) {
      return sendServerError(res, error);
    }
  }
};

export default handler;
