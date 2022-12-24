import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { authClient } from '../../src/function/request';
import Header from '../../src/components/Header';
import Loading from '../../src/components/Loading';

export default function ProviderCheck() {
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      try {
        const response = await authClient.get(`/provider/slug`);
        console.debug(`GET /provider/slug`);

        const data = response?.data;
        console.debug(data);
        if (data) {
          const { status, slug } = data;
          // slug 존재
          switch (status) {
            case 2600:
              router.replace(`/provider/${slug}`);
              return;
            case 2601:
              router.replace(`/provider/new`);
              return;
            default:
              throw new Error('알 수 없는 상태코드');
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    check();
  }, []);

  return (
    <>
      <Header type={1} />
      <Loading fullscreen />
    </>
  );
}
