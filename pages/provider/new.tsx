import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import Header from '../../src/components/Header';
import StoreForm from '../../src/components/StoreForm';
import UserContext from '../../src/contexts/UserProvider';

export default function NewStore() {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (!user?.isLogined) {
      router.replace('/auth/login');
    }
  }, []);

  return (
    <>
      <Header type={1} />
      <StoreForm data={null} />
    </>
  );
}
