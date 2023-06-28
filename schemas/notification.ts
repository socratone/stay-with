import { boolean, InferType, mixed, object, string } from 'yup';

import { ID_MAX_LENGTH, NAME_MAX_LENGTH, URL_MAX_LENGTH } from './constants';

export enum NotificationType {
  LexioDivinaLiked = 'lexio-divina-liked',
  LexioDivinaComment = 'lexio-divina-comment',
}

export const notificationSchema = object({
  _id: string().required().max(ID_MAX_LENGTH),
  userId: string().required().max(ID_MAX_LENGTH),
  type: mixed<NotificationType>()
    .required()
    .oneOf(Object.values(NotificationType)),
  message: string().max(50),
  notifier: object({
    name: string().required().max(NAME_MAX_LENGTH),
    imageUrl: string().max(URL_MAX_LENGTH),
  }),
  isNew: boolean().required(),
  lexioDivinaId: string().max(ID_MAX_LENGTH),
  commentId: string().max(ID_MAX_LENGTH),
});

export type Notification = InferType<typeof notificationSchema>;
