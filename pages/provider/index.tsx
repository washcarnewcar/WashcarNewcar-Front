import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { authClient } from '../../src/function/request';

export default function ProviderCheck() {
  const router = useRouter();

  const check = async () => {
    try {
      const response = await authClient.get(`/provider/slug`);

      const data = response?.data;
      console.log(data);
      if (data) {
        const { status, slug } = data;
        // slug 존재
        if (status === 2600) {
          router.replace(`/provider/${slug}`);
        }
        // 세차장 없음 => 새로운 세차장 생성
        else if (status === 2601) {
          router.replace(`/provider/new`);
        } else {
          throw new Error('알 수 없는 상태코드');
        }
      } else {
        throw new Error('잘못된 응답');
      }
    } catch (error) {
      console.error(error);
      router.replace(`/`);
    }
  };

  useEffect(() => {
    check();
  }, []);
}
