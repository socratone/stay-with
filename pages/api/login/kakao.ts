import axios, { AxiosResponse } from 'axios';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import Database, { CollectionName } from 'server/database';
import { User } from 'types/interfaces';
import { ApiErrorData } from 'utils/api';

export type ApiLoginKakaoPayload = {
  code: string;
};

export type ApiLoginKakaoData = {
  accessToken: string;
};

type KakaoUser = {
  id: number;
  connected_at: Date;
  properties: {
    profile_image: string;
    thumbnail_image: string;
  };
  kakao_account: {
    profile_image_needs_agreement: boolean;
    profile: {
      thumbnail_image_url: string;
      profile_image_url: string;
      is_default_image: boolean;
    };
    has_email: boolean;
    email_needs_agreement: boolean;
    is_email_valid: boolean;
    is_email_verified: boolean;
    email: string;
  };
};

export type ApiLoginKakaoErrorData = ApiErrorData & {
  kakaoUser?: KakaoUser;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiLoginKakaoData | ApiLoginKakaoErrorData>
) => {
  if (req.method === 'POST') {
    let kakaoAccessToken: string;

    const { code }: ApiLoginKakaoPayload = req.body;

    try {
      const { data: authData } = await axios.post<{ access_token: string }>(
        'https://kauth.kakao.com/oauth/token',
        {
          grant_type: 'authorization_code',
          client_id: process.env.KAKAO_REST_API_KEY,
          redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/login/redirect`,
          client_secret: process.env.KAKAO_CLIENT_SECRET,
          code,
        },
        {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        }
      );

      kakaoAccessToken = authData.access_token;
    } catch (error: any) {
      if (error?.response?.status === 400) {
        return res.status(400).json({
          message: 'Bad request.',
        });
      }

      return res.status(500).json({
        message: 'Unknown error.',
      });
    }

    const db = new Database();

    try {
      const { data: kakaoUser }: AxiosResponse<KakaoUser> = await axios.get(
        'https://kapi.kakao.com/v2/user/me',
        {
          headers: {
            Authorization: `Bearer ${kakaoAccessToken}`,
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        }
      );

      // 가입된 유저인지 확인
      const user = await db.findOne<User>(CollectionName.Users, {
        kakaoId: kakaoUser.id,
      });

      if (!user) {
        return res.status(401).json({
          message: 'Unregistered user.',
          kakaoUser,
        });
      }

      const accessToken = jwt.sign(user, process.env.AUTH_SECRET as string, {
        expiresIn: '1 days',
      });

      return res.status(200).json({ accessToken });
    } catch (error: any) {
      if (error?.response?.status === 400) {
        return res.status(400).json({
          message: 'Bad request.',
        });
      }

      const { status, message } = db.parseError(error);
      return res.status(status).send({ message });
    }
  }
};

export default handler;
