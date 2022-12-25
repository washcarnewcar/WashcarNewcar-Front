import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { authClient } from '../../src/function/request';
import Header from '../../src/components/Header';
import Loading from '../../src/components/Loading';

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
            throw new Error('알 수 없는 상태코드');
        }
      }
    };

    check();
  }, [router.isReady]);

  return (
    <>
      <Header type={1} />
      <Loading fullscreen />
    </>
  );
}
