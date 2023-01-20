import axios, { AxiosResponse } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { getUserByGoogleId } from '../../../libs/firebase/apis';

export type ApiAuthLoginPayload = {
  googleAccessToken: string;
};

export type ApiAuthLoginData = {
  accessToken: string;
};

export type GoogleUser = {
  email: string;
  id: string;
  picture: string;
  verified_email: boolean;
};

const authSecret = process.env.AUTH_SECRET;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      if (!authSecret) {
        return res.status(500).json({
          message: 'The secret key is set incorrectly.',
        });
      }

      const { googleAccessToken }: ApiAuthLoginPayload = req.body;

      // 오류가 발생하지 않는다면 정상적인 google 유저임을 입증
      // https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow#callinganapi
      const { data: googleUser }: AxiosResponse<GoogleUser> = await axios.get(
        `https://www.googleapis.com/oauth2/v2/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${googleAccessToken}`,
          },
        }
      );

      // 가입된 유저인지 확인
      const googleId = googleUser.id;
      const user = await getUserByGoogleId(googleId);
      if (!user) {
        return res.status(401).json({
          message: 'Unregistered user.',
          googleUser,
        });
      }

      const accessToken = jwt.sign(user, authSecret);

      const data: ApiAuthLoginData = { accessToken };
      return res.status(200).json(data);
    } catch (error: any) {
      const statusText = error?.response?.statusText;

      // google access token이 잘못된 경우
      if (statusText === 'Unauthorized') {
        return res.status(400).json({
          message: 'Google authentication failed.',
        });
      }

      return res.status(500).json({
        message: 'An unknown error has occurred.',
      });
    }
  }
};

export default handler;
