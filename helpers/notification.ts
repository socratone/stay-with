import { CollectionName } from 'constants/mongodb';
import { Notification } from 'schemas';
import Mongodb from 'utils/mongodb';

type AddNotificationPayload = Omit<Notification, '_id' | 'newed'>;

export const addNotification = async (
  db: Mongodb,
  payload: AddNotificationPayload
) => {
  return await db.insertOne(CollectionName.LexioDivinas, payload);
};
