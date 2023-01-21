import { NextApiRequest, NextApiResponse } from 'next';
import { addUser } from 'libs/firebase/apis';
import { User } from 'libs/firebase/interfaces';
import { ApiErrorData, responseUnknownError } from 'utils/api';

export type ApiSignUpPayload = Omit<User, 'id'>;

export type ApiSignUpData = {
  id: string;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiSignUpData | ApiErrorData>
) => {
  if (req.method === 'POST') {
    try {
      const payload: ApiSignUpPayload = req.body;
      const { id } = await addUser(payload);
      return res.status(201).json({ id });
    } catch {
      return responseUnknownError(res);
    }
  }
};

export default handler;
