import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { request } from 'http';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { Cookies } from 'react-cookie';

const API_SERVER = process.env.NEXT_PUBLIC_API;

const authClient = axios.create({
  baseURL: API_SERVER,
});

// request에 header에 access token 포함
const cookies = new Cookies();
const accessToken = cookies.get('access_token');
authClient.interceptors.request.use((config) => {
  if (!config.headers) return config;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// response 정의
authClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const {
      config,
      response: { status },
    } = error;

    // 권한 없음
    if (status === 403) {
      console.error('권한 없음');
      location.replace('/');
    }

    // 로그인되지 않음 or 토큰 만료됨
    else if (status === 401 && config.url !== '/refresh/token') {
      // 리프레시 토큰을 사용해서 엑세스 토큰 재발급 받고 발급받은 엑세스 토큰으로 다시 요청...
      // 리프레시 토큰 조차 만료되었으면 로그아웃 처리
      const accessToken = await getAccessToken();

      return axios(config);

      console.error('로그인 되지 않음');
      location.replace('/auth/login');
    } else {
      Promise.reject(error);
    }
  }
);

const getAccessToken = async () => {
  await axios.get('/refresh/token', { withCredentials: true });
};

// export const authClient = axios.create({
//   baseURL: API_SERVER,
// });

// // request에 header.... 아니 이러면...하..
// authClient.interceptors.request.use((config) => {
//   if (!config.headers) return config;
//   const token = "localStorage.getItem('token');";
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // response 정의
// authClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     // 권한 없음
//     if (error.response.status === 403) {
//       console.error('권한 없음');
//       location.replace('/');
//     } else if (error.response.status === 401) {
//       console.error('로그인 되지 않음');
//       location.replace('/auth/login');
//     } else {
//       throw error;
//     }
//   }
// );

export const client = axios.create({
  baseURL: API_SERVER,
});

export class AuthRequst {
  private client: AxiosInstance;

  constructor(context?: GetServerSidePropsContext) {
    this.client = axios.create({
      baseURL: API_SERVER,
    });

    // header 정의
    const accessToken = context?.req.cookies.access_token;
    this.client.interceptors.request.use((config) => {
      if (!config.headers) return config;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });
  }

  async request(url: string, method: string, callback: (response: AxiosResponse) => GetServerSidePropsResult<any>, config?: AxiosRequestConfig): Promise<GetServerSidePropsResult<any>> {
    try {
      const response = await this.client(url, { method: method, ...config });
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
