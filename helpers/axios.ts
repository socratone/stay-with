import axios, { AxiosResponse } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { ArrowPostResult, ArrowsData } from 'pages/api/arrows';
import { ArrowData } from 'pages/api/arrows/[id]';
import { ArrowsCountData } from 'pages/api/arrows/count';
import {
  KakaoProfilePostPayload,
  KakaoProfilePostResult,
} from 'pages/api/kakao-profile';
import { LexioDivinasData } from 'pages/api/lexio-divinas';
import { LexioDivinaData } from 'pages/api/lexio-divinas/[id]';
import { LexioDivinaCommentsData } from 'pages/api/lexio-divinas/[id]/comments';
import { LexioDivinaLikedPostPayload } from 'pages/api/lexio-divinas/[id]/likeds/index';
import { LexioDivinasCountData } from 'pages/api/lexio-divinas/count';
import {
  KakaoLoginPostPayload,
  KakaoLoginPostResult,
} from 'pages/api/login/kakao';
import { MissaData } from 'pages/api/missa';
import { NotificationsData } from 'pages/api/notifications';
import { NotificationsCountData } from 'pages/api/notifications/count';
import { UserPostResult } from 'pages/api/signup';
import { UserData } from 'pages/api/users/[id]';
import {
  ArrowPostPayload,
  ArrowPutPayload,
  LexioDivinaCommentPostPayload,
  LexioDivinaPostPayload,
  LexioDivinaPutPayload,
  NotificationPatchPayload,
  UserPatchPayload,
  UserPostPayload,
} from 'schemas';
import { getAccessToken } from 'utils/token';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000',
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    config.headers = {
      Authorization: getAccessToken(),
    };
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const status = error?.response?.status;
    const errorMessage = error?.response?.data?.error?.message ?? '';

    if (status >= 500) {
      enqueueSnackbar('서버 에러가 발생했어요 😱', {
        variant: 'error',
      });
    } else if (status === 422 && errorMessage.includes('must be at most')) {
      enqueueSnackbar('허용치를 초과한 값이 있어요 😅', {
        variant: 'error',
      });
    } else if (status === 401 && errorMessage === 'Unregistered user.') {
      // pass
    } else if (status === 404) {
      // pass
    } else {
      enqueueSnackbar('에러가 발생했어요 😫', {
        variant: 'error',
      });
    }

    return Promise.reject(error);
  }
);

export const postSignUp = (
  payload: UserPostPayload
): Promise<UserPostResult> => {
  return axiosInstance
    .post<any, AxiosResponse<UserPostResult>, UserPostPayload>(
      '/api/signup',
      payload
    )
    .then((response) => response.data);
};

export const postLoginWithKakao = (code: string) => {
  return axiosInstance
    .post<any, AxiosResponse<KakaoLoginPostResult>, KakaoLoginPostPayload>(
      '/api/login/kakao',
      {
        code,
      }
    )
    .then((response) => response.data);
};

export const postLexioDivina = (payload: LexioDivinaPostPayload) => {
  return axiosInstance.post<any, AxiosResponse, LexioDivinaPostPayload>(
    '/api/lexio-divinas',
    payload
  );
};

export const putLexioDivina = (id: string, payload: LexioDivinaPutPayload) => {
  return axiosInstance.put<any, AxiosResponse, LexioDivinaPutPayload>(
    `/api/lexio-divinas/${id}`,
    payload
  );
};

export const deleteLexioDivina = (id: string) => {
  return axiosInstance.delete(`/api/lexio-divinas/${id}`);
};

export const postLikedToLexioDivina = (
  id: string,
  payload: LexioDivinaLikedPostPayload
) => {
  return axiosInstance.post<any, AxiosResponse, LexioDivinaLikedPostPayload>(
    `/api/lexio-divinas/${id}/likeds`,
    payload
  );
};

export const deleteLikedInLexioDivina = (id: string, userId: string) => {
  return axiosInstance.delete(`/api/lexio-divinas/${id}/likeds/${userId}`);
};

export const getCommentsInLexioDivina = (
  id: string
): Promise<LexioDivinaCommentsData> => {
  return axiosInstance
    .get<any, AxiosResponse<LexioDivinaCommentsData>>(
      `/api/lexio-divinas/${id}/comments`
    )
    .then((value) => value.data);
};

export const postCommentToLexioDivina = (
  id: string,
  payload: LexioDivinaCommentPostPayload
) => {
  return axiosInstance.post<any, AxiosResponse, LexioDivinaCommentPostPayload>(
    `/api/lexio-divinas/${id}/comments`,
    payload
  );
};

export const deleteCommentInLexioDivina = (id: string, commentId: string) => {
  return axiosInstance.delete<any, AxiosResponse>(
    `/api/lexio-divinas/${id}/comments/${commentId}`
  );
};

export const getLexioDivina = (id: string): Promise<LexioDivinaData> => {
  return axiosInstance
    .get<any, AxiosResponse<LexioDivinaData>>(`/api/lexio-divinas/${id}`)
    .then((value) => value.data);
};

export type GetLexioDivinasParams = {
  skip: number;
  limit: number;
  userId?: string;
};

export const getLexioDivinas = (
  params?: GetLexioDivinasParams
): Promise<LexioDivinasData> => {
  return axiosInstance
    .get<any, AxiosResponse<LexioDivinasData>>('/api/lexio-divinas', {
      params,
    })
    .then((value) => value.data);
};

export type GetLexioDivinasCountParams = {
  userId?: string;
};

export const getLexioDivinasCount = (
  params?: GetLexioDivinasCountParams
): Promise<LexioDivinasCountData> => {
  return axiosInstance
    .get<any, AxiosResponse<LexioDivinasCountData>>(
      '/api/lexio-divinas/count',
      {
        params,
      }
    )
    .then((value) => value.data);
};

export const getUser = (id: string): Promise<UserData> => {
  return axiosInstance
    .get<any, AxiosResponse<UserData>>(`/api/users/${id}`)
    .then((value) => value.data);
};

export const patchUser = (id: string, payload: UserPatchPayload) => {
  return axiosInstance.patch<any, AxiosResponse, UserPatchPayload>(
    `/api/users/${id}`,
    payload
  );
};

export type GetArrowsParams = {
  skip: number;
  limit: number;
  userId?: string;
};

export const getArrows = (params?: GetArrowsParams): Promise<ArrowsData> => {
  return axiosInstance
    .get<any, AxiosResponse<ArrowsData>>('/api/arrows', {
      params,
    })
    .then((value) => value.data);
};

export const getArrow = (id: string): Promise<ArrowData> => {
  return axiosInstance
    .get<any, AxiosResponse<ArrowData>>(`/api/arrows/${id}`)
    .then((value) => value.data);
};

export type GetArrowsCountParams = {
  userId?: string;
};

export const getArrowsCount = (
  params?: GetArrowsCountParams
): Promise<ArrowsCountData> => {
  return axiosInstance
    .get<any, AxiosResponse<ArrowsCountData>>('/api/arrows/count', {
      params,
    })
    .then((value) => value.data);
};

export const postArrow = (payload: ArrowPostPayload) => {
  return axiosInstance
    .post<any, AxiosResponse<ArrowPostResult>, ArrowPostPayload>(
      '/api/arrows',
      payload
    )
    .then((value) => value.data);
};

export const deleteArrow = (id: string) => {
  return axiosInstance.delete(`/api/arrows/${id}`);
};

export const putArrow = (id: string, payload: ArrowPutPayload) => {
  return axiosInstance.put<any, AxiosResponse, ArrowPutPayload>(
    `/api/arrows/${id}`,
    payload
  );
};

export type GetMissaParams = {
  offset?: number;
};

export const getMissa = (params?: GetMissaParams): Promise<MissaData> => {
  return axiosInstance
    .get<any, AxiosResponse<MissaData>>('/api/missa', {
      params,
    })
    .then((value) => value.data);
};

export type GetNotificationsParams = {
  skip?: number;
  limit?: number;
  userId?: string;
};

export const getNotifications = (
  params?: GetNotificationsParams
): Promise<NotificationsData> => {
  return axiosInstance
    .get<any, AxiosResponse<NotificationsData>>('/api/notifications', {
      params,
    })
    .then((value) => value.data);
};

export type GetNotificationsCountParams = {
  userId?: string;
  isNew?: boolean;
};

export const getNotificationsCount = (
  params?: GetNotificationsCountParams
): Promise<NotificationsCountData> => {
  return axiosInstance
    .get<any, AxiosResponse<NotificationsCountData>>(
      '/api/notifications/count',
      {
        params,
      }
    )
    .then((value) => value.data);
};

export const patchNotification = (
  id: string,
  payload: NotificationPatchPayload
) => {
  return axiosInstance.patch<any, AxiosResponse, NotificationPatchPayload>(
    `/api/notifications/${id}`,
    payload
  );
};

export const postKakaoProfile = (payload: KakaoProfilePostPayload) => {
  return axiosInstance
    .post<any, AxiosResponse<KakaoProfilePostResult>, KakaoProfilePostPayload>(
      '/api/kakao-profile',
      payload
    )
    .then((value) => value.data);
};
