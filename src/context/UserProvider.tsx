import { AxiosError } from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { authClient, client } from '../function/request';

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
    try {
      // 정상적으로 처리되면 로그인 된 것
      await client.get(`/user`, { withCredentials: true });
      console.debug('logined');
      setUser({ isLogined: true });
    } catch (error) {
      // 로그인 되지 않거나, 토큰 만료됨
      if (error instanceof AxiosError && error.response?.status === 401) {
        console.debug('not logined');
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
