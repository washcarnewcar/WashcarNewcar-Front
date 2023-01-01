import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import UserContext from '../context/UserProvider';
import Header from './Header';
import Loading from './Loading';

interface LoginCheckProps {
  children?: React.ReactNode;
}

export default function LoginCheck({ children }: LoginCheckProps) {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (user) {
      if (!user.isLogined) {
        router.replace('/auth/login');
      } else {
        setReady(true);
      }
    }
  }, [user]);

  return (
    <>
      <Header />
      {ready ? children : <Loading fullscreen />}
    </>
  );
}
