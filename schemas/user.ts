import { InferType, number, object, string } from 'yup';

export const userSchema = object({
  _id: string().required().max(50),
  kakaoId: number().required().max(50),
  name: string().required().max(20),
  email: string().email().required().max(50),
  imageUrl: string().max(100),
  description: string().max(500),
});

export const userPostSchema = userSchema.omit(['_id']);
export const userPatchSchema = userSchema.omit(['_id', 'kakaoId', 'email']);

export type User = InferType<typeof userSchema>;
export type UserPostPayload = InferType<typeof userPatchSchema>;
export type UserPatchPayload = InferType<typeof userPatchSchema>;
