import { Arrow, User } from 'schemas';

export type Candle = Arrow & {
  user?: User;
  createdAt: Date;
};
