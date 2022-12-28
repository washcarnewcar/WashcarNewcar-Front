import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { authClient } from '../../src/function/request';
import Header from '../../src/components/Header';
import Loading from '../../src/components/Loading';
import Head from 'next/head';

export default function ProviderCheck() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const check = async () => {
      const response = await authClient.get(`/provider/slug`);
      const data = response?.data;
      console.debug(`GET /provider/slug`, data);
      if (data) {
        const { status, slug } = data;
        switch (status) {
          // slug 존재
          case 2600:
            router.replace(`/provider/${slug}`);
            return;
          // 세차장 만들지 않음
          case 2601:
            router.replace(`/provider/new`);
            return;
          default:
            console.error('알 수 없는 상태코드');
        }
      } else {
        console.error('잘못된 응답');
      }
    };

    check();
  }, [router.isReady]);

  return (
    <>
      <Head>
        <title>세차새차 - 손세차 중계 플랫폼</title>
      </Head>
      <Header type={1} />
      <Loading fullscreen />
    </>
  );
}
