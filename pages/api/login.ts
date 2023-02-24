import axios, { AxiosResponse } from 'axios';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import Database, { CollectionName } from 'server/database';
import { User } from 'types/interfaces';
import { ApiErrorData, AUTH_SECRET } from 'utils/api';

export type ApiLoginPayload = {
  googleAccessToken: string;
};

export type ApiLoginData = {
  accessToken: string;
};

type GoogleUser = {
  email: string;
  id: string;
  picture: string;
  verified_email: boolean;
};

export type ApiLoginErrorData = ApiErrorData & {
  googleUser?: GoogleUser;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiLoginData | ApiLoginErrorData>
) => {
  if (req.method === 'POST') {
    const db = new Database();

    try {
      const { googleAccessToken }: ApiLoginPayload = req.body;

      // 오류가 발생하지 않는다면 정상적인 google 유저임을 입증
      // https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow#callinganapi
      const { data: googleUser }: AxiosResponse<GoogleUser> = await axios.get(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${googleAccessToken}`,
          },
        }
      );

      // 가입된 유저인지 확인
      const googleId = googleUser.id;
      const user = await db.findOne<User>(CollectionName.Users, {
        googleId,
      });

      if (!user) {
        return res.status(401).json({
          message: 'Unregistered user.',
          googleUser,
        });
      }

      const accessToken = jwt.sign(user, AUTH_SECRET, {
        expiresIn: '1 days',
      });

      return res.status(200).json({ accessToken });
    } catch (error: any) {
      const statusText = error?.response?.statusText;

      // google access token이 잘못된 경우
      if (statusText === 'Unauthorized') {
        return res.status(400).json({
          message: 'Google authentication failed.',
        });
      }

      const { status, message } = db.parseError(error);
      return res.status(status).send({ message });
    }
  }
};

export default handler;
