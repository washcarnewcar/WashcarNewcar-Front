import React, { useContext, useEffect, useState } from 'react';
import Header from '../../../src/components/Header';
import { useRouter } from 'next/router';
import StoreForm from '../../../src/components/StoreForm';
import UserContext from '../../../src/contexts/UserProvider';
import axios from 'axios';

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
  const { user, setUser } = useContext(UserContext);
  const { slug } = router.query;
  const [data, setData] = useState({});

  const getData = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API}/store/${slug}/info`
    );

    console.log(response);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Header type={1} />
      <StoreForm data={data} />
    </>
  );
}
