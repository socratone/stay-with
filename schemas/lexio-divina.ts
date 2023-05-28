import { Bible } from 'constants/bible';
import { array, InferType, mixed, number, object, string } from 'yup';

export const lexioDivinaCommentSchema = object({
  _id: string().required(),
  userId: string().required(),
  message: string().required(),
});

export const lexioDivinaCommentPostSchema = lexioDivinaCommentSchema.omit([
  '_id',
]);

export type LexioDivinaComment = InferType<typeof lexioDivinaCommentSchema>;
export type LexioDivinaCommentPostPayload = InferType<
  typeof lexioDivinaCommentPostSchema
>;

export const lexioDivinaSchema = object({
  _id: string().required(),
  bible: mixed<Bible>().required().oneOf(Object.values(Bible)),
  content: string().required(),
  phrase: string().required(),
  chapter: number().required().positive().integer(),
  verse: number().required().positive().integer(),
  endChapter: number().positive().integer(),
  endVerse: number().positive().integer(),
  userId: string().required(),
  likedUserIds: array().required().of(string().required()),
  comments: array().required().of(lexioDivinaCommentSchema),
});

export const lexioDivinaPostSchema = lexioDivinaSchema.omit(['_id']);
export const lexioDivinaPutSchema = lexioDivinaSchema.omit([
  '_id',
  'userId',
  'likedUserIds',
  'comments',
]);

export type LexioDivina = InferType<typeof lexioDivinaSchema>;
export type LexioDivinaPostPayload = InferType<typeof lexioDivinaPostSchema>;
export type LexioDivinaPutPayload = InferType<typeof lexioDivinaPutSchema>;
