import axios from 'axios';

const API_SERVER = process.env.NEXT_PUBLIC_API;

export const authClient = axios.create({
  baseURL: API_SERVER,
});

authClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (config.headers) {
    if (!token) {
      config.headers['Authorization'] = null;
      return config;
    } else {
      config.headers['Authorization'] = 'Bearer ' + token;
      return config;
    }
  } else {
    return config;
  }
});

authClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // 권한 없음
    if (error.response.status === 403) {
      console.error('권한 없음');
      location.href = '/';
    } else if (error.response.status === 401) {
      console.error('로그인 되지 않음');
      location.href = '/auth/login';
    }
  }
);

export const client = axios.create({
  baseURL: API_SERVER,
});

// export const checkLogin = async (): Promise<boolean> => {
//   const localToken = localStorage.getItem('token');
//   if (!localToken) return false;

//   const token = {
//     Authorization: 'Bearer ' + localStorage.getItem('token'),
//   };

//   const response = await fetch(`${API_SERVER}/auth/check`, {
//     method: 'post',
//     headers: token,
//   });
//   if (response.status !== 200) return false;
//   const json = await response.json();
//   return json as boolean;
// };

// export const requestWithToken = async (
//   router: NextRouter,
//   setUser: React.Dispatch<React.SetStateAction<User | null>>,
//   path: string,
//   options?: AxiosRequestConfig
// ): Promise<AxiosResponse | null> => {
//   const token = localStorage.getItem('token')
//     ? {
//         Authorization: 'Bearer ' + localStorage.getItem('token'),
//       }
//     : null;

//   if (!token) {
//     alert('로그인 후 이용해주세요');
//     router.replace('/auth/login');
//     setUser({ isLogined: false });
//     return null;
//   }

//   const headers = {
//     ...options?.headers,
//     ...token,
//   };

//   try {
//     const response = await axios(`${API_SERVER}${path}`, {
//       ...options,
//       headers: headers,
//     });
//     return response;
//   } catch (error) {
//     // 예외처리
//     if (error instanceof AxiosError) {
//       // 로그인되지 않음 => 로그인화면 이동
//       if (error.response?.status === 401) {
//         alert('로그인 후 이용해주세요');
//         router.replace('/auth/login');
//         setUser({ isLogined: false });
//         return null;
//       }
//       // 권한 없음 => 홈화면 이동
//       else if (error.response?.status === 403) {
//         alert('권한이 없습니다');
//         router.replace('/');
//         return null;
//       }
//     }
//     throw error;
//   }
// };
