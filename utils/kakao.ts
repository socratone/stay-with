import axios from 'axios';

/**
 * 토큰 받기
 * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-token
 */
export const postKakaoOAuthToken = (code: string) => {
  return axios.post<{ access_token: string }>(
    'https://kauth.kakao.com/oauth/token',
    {
      grant_type: 'authorization_code',
      client_id: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/login/redirect`,
      client_secret: process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET,
      code,
    },
    {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    }
  );
};

export type KakaoUser = {
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

/**
 * 커스텀 에러
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#custom_error_types
 */
class UserError extends Error {
  code: number;

  constructor(code: number, ...params: any) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UserError);
    }

    // Custom debugging information
    this.code = code;
  }
}

/**
 * 사용자 정보 가져오기
 * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#req-user-info
 */
export const getKakaoUserMe = async (accessToken: string) => {
  const response = await fetch('https://kapi.kakao.com/v2/user/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new UserError(result.code, result.msg);
  }

  const kakaoUser: KakaoUser = result;
  return kakaoUser;
};
