import { InferType, number, object, string } from 'yup';

import { ID_MAX_LENGTH, NAME_MAX_LENGTH, URL_MAX_LENGTH } from './constants';

export const userSchema = object({
  _id: string().required().max(ID_MAX_LENGTH),
  kakaoId: number().required(),
  name: string().required().max(NAME_MAX_LENGTH),
  email: string().email().required().max(50),
  imageUrl: string().max(URL_MAX_LENGTH),
  description: string().max(500),
});

export const userPostSchema = userSchema.omit(['_id']);
export const userPatchSchema = userSchema.omit(['_id', 'kakaoId', 'email']);

export type User = InferType<typeof userSchema>;
export type UserPostPayload = InferType<typeof userPatchSchema>;
export type UserPatchPayload = InferType<typeof userPatchSchema>;
