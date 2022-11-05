import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';

export default function Redirect() {
  const router = useRouter();
  const { token } = router.query;

  const redirect = useCallback(() => {
    if (!token || typeof token !== 'string') {
      router.replace('/');
    } else {
      localStorage.clear();
      localStorage.setItem('token', token);
      router.replace('/');
    }
  }, [token, router]);

  useEffect(() => {
    redirect();
  }, [redirect]);

  return <></>;
}
