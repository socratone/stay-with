import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { ServerError } from 'utils/error';

export type DevLoginPostPayload = {
  id: string;
};

export type DevLoginPostResult = {
  accessToken: string;
};

/** Only dev */
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<DevLoginPostResult | ServerError>
) => {
  if (process.env.NEXT_PUBLIC_ENV !== 'development') {
    return res.status(400).json({
      error: {
        message: 'Not found.',
      },
    });
  }

  const { id }: DevLoginPostPayload = req.body;

  if (!id) {
    return res.status(400).json({
      error: {
        message: 'Id is required.',
      },
    });
  }

  if (req.method === 'POST') {
    const mockUser = {
      _id: id,
      kakaoId: 1,
      email: 'tester@tester.com',
      name: '테스터',
      imageUrl: 'https://picsum.photos/200',
      description: '안녕하세요! 테스터입니다.',
    };

    const accessToken = jwt.sign(mockUser, process.env.AUTH_SECRET as string, {
      expiresIn: '2 days',
    });

    return res.status(200).json({ accessToken });
  }
};

export default handler;
