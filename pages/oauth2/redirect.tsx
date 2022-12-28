import Head from 'next/head';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import Loading from '../../src/components/Loading';
import UserContext from '../../src/context/UserProvider';

export default function OAuthRedirect() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const { token, refresh } = router.query;

  useEffect(() => {
    if (!router.isReady) return;
    // 토큰 값이 잘 전달됐다면
    if (typeof token === 'string' && typeof refresh === 'string') {
      // 토큰 저장
      localStorage.setItem('token', token);
      localStorage.setItem('refresh_token', refresh);
      setUser({ isLogined: true });
    }
    // 홈화면으로
    router.replace('/');
  }, [router.isReady]);

  return (
    <>
      <Head>
        <title>세차새차 - 손세차 중계 플랫폼</title>
      </Head>
      <Loading fullscreen />
    </>
  );
}
