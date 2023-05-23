import { InferType, object, string } from 'yup';

export const arrowSchema = object({
  _id: string().required(),
  userId: string().required(),
  message: string().required(),
});

export const arrowPostSchema = arrowSchema.omit(['_id']);

export type Arrow = InferType<typeof arrowSchema>;
export type ArrowPostPayload = InferType<typeof arrowPostSchema>;
