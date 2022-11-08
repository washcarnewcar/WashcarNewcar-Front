import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import Header from '../../../../components/Header';
import MenuForm from '../../../../components/MenuForm';
import styles from '../../../../styles/MenuEdit.module.scss';

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
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/store/${slug}/menu/${number}`
      );
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
