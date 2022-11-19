import axios, { AxiosError } from 'axios';
import React, { createContext, useEffect, useState } from 'react';

export interface User {
  isLogined: boolean;
}

export interface UserContext {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContext>({
  user: null,
  setUser: () => {},
});
export default UserContext;

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const getUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('token not exist');
      setUser({ isLogined: false });
      return;
    }

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/user`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      if (response.status === 200) {
        console.log('logined');
        setUser({ isLogined: true });
      }
    } catch (error) {
      // 로그인 되지 않거나, 토큰 만료됨
      if (error instanceof AxiosError && error.response?.status === 401) {
        console.log('token expired');
        setUser({ isLogined: false });
        return;
      } else {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const value = {
    user: user,
    setUser: setUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
