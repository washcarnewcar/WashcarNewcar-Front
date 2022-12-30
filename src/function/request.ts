import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

const API_SERVER = process.env.NEXT_PUBLIC_API;

export const client = axios.create({
  baseURL: API_SERVER,
});

export const authClient = axios.create({
  baseURL: API_SERVER,
  withCredentials: true,
});

// response 정의
authClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // 권한 없음
    if (error.response.status === 403) {
      console.error('권한 없음');
      location.replace('/');
    }
    // 인증정보 없음
    else if (error.response.status === 401) {
      console.error('인증정보 없음');
      location.replace('/auth/login');
    } else {
      throw error;
    }
  }
);

export const server = axios.create({
  baseURL: API_SERVER,
});

export class AuthServer {
  private authServer: AxiosInstance;

  constructor(context: GetServerSidePropsContext) {
    const cookie = context.req.headers.cookie;
    this.authServer = axios.create({
      baseURL: API_SERVER,
      headers: {
        Cookie: cookie ? cookie : '',
      },
    });
  }

  async request(url: string, method: string, callback: (response: AxiosResponse) => GetServerSidePropsResult<any>, config?: AxiosRequestConfig): Promise<GetServerSidePropsResult<any>> {
    try {
      const response = await this.authServer(url, { method: method, ...config });
      return callback(response);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          console.error('권한 없음');
          return { redirect: { destination: '/', statusCode: 302 } };
        } else if (error.response?.status === 401) {
          console.error('인증정보 없음');
          return { redirect: { destination: '/auth/login', statusCode: 302 } };
        } else {
          return { redirect: { destination: '/error', statusCode: 302 } };
        }
      } else {
        return { redirect: { destination: '/error', statusCode: 302 } };
      }
    }
  }

  async get(url: string, callback: (response: AxiosResponse) => GetServerSidePropsResult<any>, config?: AxiosRequestConfig) {
    return this.request(url, 'get', callback, config);
  }

  async post(url: string, callback: (response: AxiosResponse) => GetServerSidePropsResult<any>, config?: AxiosRequestConfig) {
    return this.request(url, 'post', callback, config);
  }

  async put(url: string, callback: (response: AxiosResponse) => GetServerSidePropsResult<any>, config?: AxiosRequestConfig) {
    return this.request(url, 'put', callback, config);
  }

  async delete(url: string, callback: (response: AxiosResponse) => GetServerSidePropsResult<any>, config?: AxiosRequestConfig) {
    return this.request(url, 'delete', callback, config);
  }
}
