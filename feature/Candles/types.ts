import { Arrow, User } from 'types/document';

export type Candle = Partial<Arrow> & {
  user?: User;
  createdAt?: Date;
  message: string;
};
