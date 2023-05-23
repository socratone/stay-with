import { User } from 'schemas/user';
import { Arrow } from 'types/document';

export type Candle = Partial<Arrow> & {
  user?: User;
  createdAt?: Date;
  message: string;
};
