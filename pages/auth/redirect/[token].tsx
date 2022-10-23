import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Redirect() {
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (!token || typeof token !== 'string') {
      router.push('/');
    } else {
      localStorage.clear();
      localStorage.setItem('token', token);
      router.push('/');
    }
  }, []);

  return <></>;
}
