import axios, { AxiosResponse } from 'axios';
import {
  ApiLexioDivinaPayload,
  ApiLexioDivinasData,
} from 'pages/api/lexio-divinas';
import {
  ApiLexioDivinaData,
  ApiPutLexioDivinaPayload,
} from 'pages/api/lexio-divinas/[id]';
import { ApiCommentPayload } from 'pages/api/lexio-divinas/[id]/comments';
import { ApiLikedPayload } from 'pages/api/lexio-divinas/[id]/likeds/index';
import { ApiLoginKakaoData, ApiLoginKakaoPayload } from 'pages/api/login/kakao';
import { ApiSignUpData, ApiSignUpPayload } from 'pages/api/signup';
import { ApiUserData } from 'pages/api/users/[id]';
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
  payload: ApiSignUpPayload
): Promise<ApiSignUpData> => {
  return axiosInstance
    .post<any, AxiosResponse<ApiSignUpData>, ApiSignUpPayload>(
      '/api/signup',
      payload
    )
    .then((response) => response.data);
};

export const postLoginWithKakao = (code: string) => {
  return axiosInstance
    .post<any, AxiosResponse<ApiLoginKakaoData>, ApiLoginKakaoPayload>(
      '/api/login/kakao',
      {
        code,
      }
    )
    .then((response) => response.data);
};

export const postLexioDivina = (payload: ApiLexioDivinaPayload) => {
  return axiosInstance.post<any, AxiosResponse, ApiLexioDivinaPayload>(
    '/api/lexio-divinas',
    payload
  );
};

export const putLexioDivina = (
  id: string,
  payload: ApiPutLexioDivinaPayload
) => {
  return axiosInstance.put<any, AxiosResponse, ApiPutLexioDivinaPayload>(
    `/api/lexio-divinas/${id}`,
    payload
  );
};

export const deleteLexioDivina = (id: string) => {
  return axiosInstance.delete(`/api/lexio-divinas/${id}`);
};

export const postLikedToLexioDivina = (
  id: string,
  payload: ApiLikedPayload
) => {
  return axiosInstance.post<any, AxiosResponse, ApiLikedPayload>(
    `/api/lexio-divinas/${id}/likeds`,
    payload
  );
};

export const deleteLikedInLexioDivina = (id: string, userId: string) => {
  return axiosInstance.delete(`/api/lexio-divinas/${id}/likeds/${userId}`);
};

export const postCommentToLexioDivina = (
  id: string,
  payload: ApiCommentPayload
) => {
  return axiosInstance.post<any, AxiosResponse, ApiCommentPayload>(
    `/api/lexio-divinas/${id}/comments`,
    payload
  );
};

export const deleteCommentInLexioDivina = (id: string, commentId: string) => {
  return axiosInstance.delete<any, AxiosResponse>(
    `/api/lexio-divinas/${id}/comments/${commentId}`
  );
};

export const getLexioDivina = (id: string): Promise<ApiLexioDivinaData> => {
  return axiosInstance
    .get<any, AxiosResponse<ApiLexioDivinaData>>(`/api/lexio-divinas/${id}`)
    .then((value) => value.data);
};

export type GetLexioDivinasParams = {
  offset?: number;
  count?: number;
};

export const getLexioDivinas = (
  params?: GetLexioDivinasParams
): Promise<ApiLexioDivinasData> => {
  return axiosInstance
    .get<any, AxiosResponse<ApiLexioDivinasData>>('/api/lexio-divinas', {
      params,
    })
    .then((value) => value.data);
};

export const getUser = (id: string): Promise<ApiUserData> => {
  return axiosInstance
    .get<any, AxiosResponse<ApiUserData>>(`/api/users/${id}`)
    .then((value) => value.data);
};
