import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { authClient } from '../../src/function/request';

export default function ProviderCheck() {
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      try {
        const response = await authClient.get(`/provider/slug`);

        const data = response?.data;
        console.log(data);
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
        } else {
          throw new Error('잘못된 응답');
        }
      } catch (error) {
        console.error(error);
      }
    };

    check();
  }, []);
}
