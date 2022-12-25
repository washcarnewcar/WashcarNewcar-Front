import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LoginCheck from '../../../src/components/LoginCheck';
import StoreForm from '../../../src/components/StoreForm';
import { StoreDto } from '../../../src/dto';
import { authClient } from '../../../src/function/request';

export default function EditStore() {
  const router = useRouter();
  const { slug } = router.query;
  const [data, setData] = useState<StoreDto>();

  useEffect(() => {
    if (!router.isReady) return;

    const getData = async () => {
      const response = await authClient.get(`/provider/${slug}/store`);
      const data: StoreDto | undefined = response?.data;
      console.debug(`GET /provider/${slug}/store`, data);
      if (data) {
        setData(data);
      } else {
        throw Error('data 전송되지 않음');
      }
    };

    if (slug) {
      getData();
    } else {
      router.replace('/');
    }
  }, [router.isReady]);

  return (
    <LoginCheck>
      <StoreForm data={data} />
    </LoginCheck>
  );
}
