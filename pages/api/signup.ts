import { NextApiRequest, NextApiResponse } from 'next';
import { addUser } from '../../libs/firebase/apis';
import { User } from '../../libs/firebase/interfaces';

export type ApiSignUpPayload = Omit<User, 'id'>;

export type ApiSignUpData = {
  id: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const payload: ApiSignUpPayload = req.body;
      const { id } = await addUser(payload);
      return res.status(201).json({
        id,
      });
    } catch {
      return res.status(500).json({
        message: 'An unknown error has occurred.',
      });
    }
  }
};

export default handler;
