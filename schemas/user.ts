import { InferType, number, object, string } from 'yup';

export const userSchema = object({
  _id: string().required(),
  kakaoId: number().required(),
  name: string().required(),
  email: string().email().required(),
  imageUrl: string(),
  description: string(),
});

export const userPatchSchema = userSchema.omit(['_id', 'kakaoId', 'email']);

export type User = InferType<typeof userSchema>;
export type UserPatchPayload = InferType<typeof userPatchSchema>;
