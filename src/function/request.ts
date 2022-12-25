import axios from 'axios';

const API_SERVER = process.env.NEXT_PUBLIC_API;

export const authClient = axios.create({
  baseURL: API_SERVER,
});

// request 정의
authClient.interceptors.request.use((config) => {
  if (!config.headers) return config;
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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
    } else if (error.response.status === 401) {
      console.error('로그인 되지 않음');
      location.replace('/auth/login');
    } else {
      throw error;
    }
  }
);

export const client = axios.create({
  baseURL: API_SERVER,
});
