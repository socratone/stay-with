import axios from 'axios';
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

export default axiosInstance;
