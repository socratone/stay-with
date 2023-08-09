import { Bible } from 'constants/bible';
import { array, boolean, InferType, mixed, number, object, string } from 'yup';

import {
  BIBLE_CHAPTER_MAX_NUMBER,
  BIBLE_VERSE_MAX_NUMBER,
  COMMENT_MESSAGE_MAX_LENGTH,
  ID_MAX_LENGTH,
} from './constants';

export const lexioDivinaCommentSchema = object({
  _id: string().required().max(ID_MAX_LENGTH),
  userId: string().required().max(ID_MAX_LENGTH),
  message: string().required().max(COMMENT_MESSAGE_MAX_LENGTH),
});

export const lexioDivinaCommentPostSchema = lexioDivinaCommentSchema.omit([
  '_id',
]);

export type LexioDivinaComment = InferType<typeof lexioDivinaCommentSchema>;
export type LexioDivinaCommentPostPayload = InferType<
  typeof lexioDivinaCommentPostSchema
>;

export const lexioDivinaSchema = object({
  _id: string().required().max(ID_MAX_LENGTH),
  bible: mixed<Bible>().required().oneOf(Object.values(Bible)),
  content: string().required().max(2000),
  phrase: string().required().max(500),
  chapter: number()
    .required()
    .positive()
    .integer()
    .max(BIBLE_CHAPTER_MAX_NUMBER),
  verse: number().required().positive().integer().max(BIBLE_VERSE_MAX_NUMBER),
  endChapter: number().positive().integer().max(BIBLE_CHAPTER_MAX_NUMBER),
  endVerse: number().positive().integer().max(BIBLE_VERSE_MAX_NUMBER),
  userId: string().required().max(ID_MAX_LENGTH),
  likedUserIds: array().required().of(string().required()),
  comments: array().required().of(lexioDivinaCommentSchema),
  deleted: boolean(),
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
