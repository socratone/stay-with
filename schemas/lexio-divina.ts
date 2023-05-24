import { Bible } from 'constants/bible';
import { array, InferType, mixed, number, object, string } from 'yup';

export const lexioDivinaSchema = object({
  _id: string().required(),
  bible: mixed().oneOf(Object.values(Bible)),
  content: string().required(),
  phrase: string().required(),
  chapter: number().required().positive().integer(),
  verse: number().required().positive().integer(),
  endChapter: number().positive().integer(),
  endVerse: number().positive().integer(),
  userId: string().required(),
  likedUserIds: array().of(string()),
  comments: array().of(
    object({
      _id: string().required(),
      userId: string().required(),
      message: string().required(),
    })
  ),
});

export const lexioDivinaPostSchema = lexioDivinaSchema.omit(['_id']);

export type LexioDivina = InferType<typeof lexioDivinaSchema>;
export type LexioDivinaPostPayload = InferType<typeof lexioDivinaPostSchema>;
