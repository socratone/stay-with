import axios, { AxiosResponse } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { sendServerError, ServerError } from 'utils/error';

export type KakaoProfilePostPayload = {
  code: string;
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

export type KakaoProfilePostResult = {
  imageUrl: string;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<KakaoProfilePostResult | ServerError>
) => {
  if (req.method === 'POST') {
    // 카카오 로그인 페이지에서 이동 후 받은 code
    const { code }: KakaoProfilePostPayload = req.body;

    try {
      const { data: authData } = await axios.post<{ access_token: string }>(
        'https://kauth.kakao.com/oauth/token',
        {
          grant_type: 'authorization_code',
          client_id: process.env.KAKAO_REST_API_KEY,
          redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/settings/profile`,
          client_secret: process.env.KAKAO_CLIENT_SECRET,
          code,
        },
        {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        }
      );

      const { data: kakaoUser }: AxiosResponse<KakaoUser> = await axios.get(
        'https://kapi.kakao.com/v2/user/me',
        {
          headers: {
            Authorization: `Bearer ${authData.access_token}`,
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        }
      );

      return res
        .status(200)
        .json({ imageUrl: kakaoUser.kakao_account.profile.profile_image_url });
    } catch (error: any) {
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
