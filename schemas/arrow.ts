import { InferType, object, string } from 'yup';

import { ID_MAX_LENGTH } from './constants';

export const arrowSchema = object({
  _id: string().required().max(ID_MAX_LENGTH),
  userId: string().required().max(ID_MAX_LENGTH),
  message: string().required().max(500),
});

export const arrowPostSchema = arrowSchema.omit(['_id']);
export const arrowPutSchema = arrowSchema.omit(['_id', 'userId']);

export type Arrow = InferType<typeof arrowSchema>;
export type ArrowPostPayload = InferType<typeof arrowPostSchema>;
export type ArrowPutPayload = InferType<typeof arrowPutSchema>;
