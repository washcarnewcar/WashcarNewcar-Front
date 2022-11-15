import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import UserContext from '../../src/contexts/UserProvider';
import { authClient } from '../../src/functions/request';

export default function ProviderCheck() {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);

  const check = async () => {
    try {
      const response = await authClient.get(`/provider/slug`);

      const data = response?.data;
      if (data) {
        const { status, slug } = data;
        // slug 존재
        if (status === 2600) {
          router.replace(`/provider/${slug}`);
        }
        // 세차장 없음
        else if (status === 2601) {
          router.replace(`/provider/new`);
        } else {
          throw new Error('알 수 없는 상태코드');
        }
      } else {
        throw new Error('데이터 오지 않음');
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
