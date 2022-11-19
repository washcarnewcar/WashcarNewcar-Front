import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import Header from '../../../../src/components/Header';
import MenuForm from '../../../../src/components/MenuForm';
import { client } from '../../../../src/function/request';

interface Data {
  image: string;
  name: string;
  detail: string;
  price: number;
}

export default function MenuEdit() {
  const router = useRouter();
  const { slug, number } = router.query;
  const [data, setData] = useState<Data | undefined>();

  const getData = useCallback(async () => {
    if (slug && number) {
      const response = await client.get(`/store/${slug}/menu/${number}`);
      const responseData: Data = response.data;
      console.log(response.data);
      setData(responseData);
    }
  }, [number, slug]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <>
      <Header type={1} />
      <MenuForm slug={slug as string} data={data} />
    </>
  );
}
