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
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          // TODO: 토큰 만료 로직 삽입
          setUser({ isLogined: false });
          return;
        }
      }
      console.error(error);
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
