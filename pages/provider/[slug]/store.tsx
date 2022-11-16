import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import Header from '../../../src/components/Header';
import StoreForm from '../../../src/components/StoreForm';
import UserContext from '../../../src/contexts/UserProvider';
import { client } from '../../../src/functions/request';

interface JsonData {
  name: string;
  preview_image: string;
  images: string[];
  phone: string;
  address: string;
  wayto: string;
  info: string;
}

export default function EditStore() {
  const router = useRouter();
  const { slug } = router.query;
  const [data, setData] = useState({});

  useEffect(() => {
    const getData = async () => {
      try {
        const infoResponse = await client.get(`/store/${slug}/info`);
        const info = infoResponse.data;
        console.log('info');
        console.log(info);

        const detailResponse = await client.get(`/store/${slug}/detail`);
        const detail = detailResponse.data;
        console.log('detail');
        console.log(detail);
      } catch (error) {
        console.error(error);
      }
    };

    if (slug) {
      getData();
    }
  }, [slug]);

  return (
    <>
      <Header type={1} />
      <StoreForm data={data} />
    </>
  );
}
