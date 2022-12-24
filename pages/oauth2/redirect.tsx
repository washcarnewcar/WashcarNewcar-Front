import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import Loading from '../../src/components/Loading';
import UserContext from '../../src/context/UserProvider';

export default function OAuthRedirect() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const { token, refresh } = router.query;

  useEffect(() => {
    if (
      router &&
      token &&
      refresh &&
      typeof token === 'string' &&
      typeof refresh === 'string'
    ) {
      // 토큰 저장
      localStorage.setItem('token', token);
      localStorage.setItem('refresh_token', refresh);
      setUser({ isLogined: true });

      // 홈화면으로
      router.replace('/');
    }
  }, [router, token, refresh]);

  // 1초 내에 token과 refresh를 가져오지 못하면 홈으로
  useEffect(() => {
    setTimeout(() => {
      router.push('/');
    }, 1000);
  }, []);

  return <Loading fullscreen />;
}
