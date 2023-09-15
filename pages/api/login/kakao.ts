import { CollectionName } from 'constants/mongodb';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from 'schemas';
import { sendServerError, ServerError } from 'utils/error';
import { getKakaoUserMe, KakaoUser } from 'utils/kakao';
import Mongodb from 'utils/mongodb';

export type KakaoLoginPostPayload = {
  accessToken: string;
};

export type KakaoLoginPostResult = {
  accessToken: string;
};

export interface KakaoLoginError extends ServerError {
  error: {
    message: string;
    code?: number;
    kakaoUser: KakaoUser;
  };
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<KakaoLoginPostResult | ServerError | KakaoLoginError>
) => {
  if (req.method === 'POST') {
    const { accessToken: kakaoAccessToken }: KakaoLoginPostPayload = req.body;
    const db = new Mongodb();

    try {
      const kakaoUser = await getKakaoUserMe(kakaoAccessToken);

      // 가입된 유저인지 확인
      const user = await db.findOne<User>(CollectionName.Users, {
        kakaoId: kakaoUser.id,
      });

      if (!user) {
        db.close();
        return res.status(401).json({
          error: {
            message: 'Unregistered user.',
            kakaoUser,
          },
        });
      }

      const accessToken = jwt.sign(user, process.env.AUTH_SECRET as string, {
        expiresIn: '2 days',
      });

      db.close();
      return res.status(200).json({ accessToken });
    } catch (error: any) {
      if (error?.code) {
        return res.status(500).json({
          error: {
            message: error.message,
            code: error.code,
          },
        });
      }

      if (error?.response?.status === 400) {
        return res.status(400).json({
          error: { message: 'Bad request.' },
        });
      }

      return sendServerError(res, error);
    }
  }
};

export default handler;
