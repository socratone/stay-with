import axios, { AxiosResponse } from 'axios';
import { ArrowsData } from 'pages/api/arrows';
import {
  LexioDivinaPostPayload,
  LexioDivinasData,
} from 'pages/api/lexio-divinas';
import {
  LexioDivinaData,
  LexioDivinaPutPayload,
} from 'pages/api/lexio-divinas/[id]';
import { LexioDivinaCommentPostPayload } from 'pages/api/lexio-divinas/[id]/comments';
import { LexioDivinaLikedPostPayload } from 'pages/api/lexio-divinas/[id]/likeds/index';
import {
  KakaoLoginPostPayload,
  KakaoLoginPostResult,
} from 'pages/api/login/kakao';
import { UserPostResult } from 'pages/api/signup';
import { UserData } from 'pages/api/users/[id]';
import { ArrowPostPayload, UserPatchPayload, UserPostPayload } from 'schemas';
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

export const postArrow = (payload: ArrowPostPayload) => {
  return axiosInstance.post<any, AxiosResponse, ArrowPostPayload>(
    '/api/arrows',
    payload
  );
};
