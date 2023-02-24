import { AxiosResponse } from 'axios';
import axiosInstance from './instance';
import { ApiLikedPayload } from 'pages/api/posts/[id]/likeds/index';
import { ApiGetPostData, ApiPutPostPayload } from 'pages/api/posts/[id]';
import { ApiPostPayload, ApiPostsData } from 'pages/api/posts';
import { ApiLoginData, ApiLoginPayload } from 'pages/api/login';
import { ApiSignUpData, ApiSignUpPayload } from 'pages/api/signup';
import { ApiCommentPayload } from 'pages/api/posts/[id]/comments';

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

export const postLogin = (googleAccessToken: string): Promise<ApiLoginData> => {
  return axiosInstance
    .post<any, AxiosResponse<ApiLoginData>, ApiLoginPayload>('/api/login', {
      googleAccessToken,
    })
    .then((response) => response.data);
};

export const postPost = (payload: ApiPostPayload) => {
  return axiosInstance.post<any, AxiosResponse, ApiPostPayload>(
    '/api/posts',
    payload
  );
};

export const putPost = (id: string, payload: ApiPutPostPayload) => {
  return axiosInstance.put<any, AxiosResponse, ApiPutPostPayload>(
    `/api/posts/${id}`,
    payload
  );
};

export const deletePost = (id: string) => {
  return axiosInstance.delete(`/api/posts/${id}`);
};

export const postLikedToPost = (id: string, payload: ApiLikedPayload) => {
  return axiosInstance.post<any, AxiosResponse, ApiLikedPayload>(
    `/api/posts/${id}/likeds`,
    payload
  );
};

export const deleteLikedInPost = (id: string, userId: string) => {
  return axiosInstance.delete(`/api/posts/${id}/likeds/${userId}`);
};

export const postCommentToPost = (id: string, payload: ApiCommentPayload) => {
  return axiosInstance.post<any, AxiosResponse, ApiCommentPayload>(
    `/api/posts/${id}/comments`,
    payload
  );
};

export const deleteCommentInPost = (id: string, commentId: string) => {
  return axiosInstance.delete<any, AxiosResponse>(
    `/api/posts/${id}/comments/${commentId}`
  );
};

export const getPost = (id: string): Promise<ApiGetPostData> => {
  return axiosInstance
    .get<any, AxiosResponse<ApiGetPostData>>(`/api/posts/${id}`)
    .then((value) => value.data);
};

export type GetPostsParams = {
  offset?: number;
  count?: number;
};

export const getPosts = (params?: GetPostsParams): Promise<ApiPostsData> => {
  return axiosInstance
    .get<any, AxiosResponse<ApiPostsData>>('/api/posts', {
      params,
    })
    .then((value) => value.data);
};
