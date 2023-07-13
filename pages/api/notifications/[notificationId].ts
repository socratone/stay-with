import { CollectionName } from 'constants/mongodb';
import jwtDecode from 'jwt-decode';
import { ObjectId, UpdateResult } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { Notification, User } from 'schemas';
import { sendServerError, ServerError } from 'utils/error';
import Mongodb from 'utils/mongodb';

type NotificationPatchResult = UpdateResult;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<NotificationPatchResult | ServerError>
) => {
  const notificationId = String(req.query.notificationId);
  const isNew: boolean | undefined = req.body.isNew;

  if (isNew === undefined) {
    return res.status(400).json({
      error: { message: 'isNew is required.' },
    });
  }

  if (req.method === 'PATCH') {
    try {
      const accessToken = req.headers.authorization;
      const user: User = jwtDecode(accessToken as string);

      const db = new Mongodb();

      const notification = await db.findOne<Notification>(
        CollectionName.Notifications,
        {
          _id: new ObjectId(notificationId),
        }
      );

      // 본인이 요청하지 않은 경우
      if (String(notification?.userId) !== user._id) {
        db.close();
        return res.status(400).json({
          error: { message: 'Not yourself.' },
        });
      }

      const result = await db.updateOne(
        CollectionName.Notifications,
        {
          _id: new ObjectId(notificationId),
        },
        {
          $set: { isNew },
        }
      );

      db.close();
      return res.status(200).json(result);
    } catch (error) {
      return sendServerError(res, error);
    }
  }
};

export default handler;
