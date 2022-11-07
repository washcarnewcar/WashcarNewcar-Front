import { useRouter } from 'next/router';
import React from 'react';
import Header from '../../../../components/Header';
import MenuForm from '../../../../components/MenuForm';
import styles from '../../../../styles/MenuEdit.module.scss';

export default function MenuEdit() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <>
      <Header type={1} />
      <MenuForm />
    </>
  );
}
