import { useRouter } from 'next/router';
import React from 'react';
import Header from '../../../../components/Header';
import MenuForm from '../../../../components/MenuForm';
import styles from '../../../../styles/MenuNew.module.scss';

export default function MenuNew() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <>
      <Header type={1} />
      <MenuForm slug={slug as string} data={null} />
    </>
  );
}
