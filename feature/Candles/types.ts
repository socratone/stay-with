import { Arrow, User } from 'schemas';

export type Candle = Partial<Arrow> & {
  user?: User;
  createdAt?: Date;
  message: string;
};
