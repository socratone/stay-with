import { CollectionName } from 'constants/mongodb';
import { ObjectId } from 'mongodb';
import { Notification } from 'schemas';
import Mongodb from 'utils/mongodb';

type AddNotificationPayload = Omit<
  Notification,
  | '_id'
  | 'isNew'
  | 'userId'
  | 'lexioDivinaId'
  | 'commentId'
  | 'isNew'
  | 'createdAt'
> & {
  userId: ObjectId;
  lexioDivinaId?: ObjectId;
  commentId?: ObjectId;
};

export const addNotification = (
  db: Mongodb,
  payload: AddNotificationPayload
) => {
  return db.insertOne(CollectionName.Notifications, {
    ...payload,
    isNew: true,
    createdAt: new Date(),
  });
};
