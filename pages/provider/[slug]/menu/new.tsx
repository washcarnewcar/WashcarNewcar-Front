import { useRouter } from 'next/router';
import React from 'react';
import Header from '../../../../src/components/Header';
import LoginCheck from '../../../../src/components/LoginCheck';
import MenuForm from '../../../../src/components/MenuForm';
import styles from '../../../../styles/MenuNew.module.scss';

export default function MenuNew() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <LoginCheck>
      <MenuForm slug={slug as string} data={null} />
    </LoginCheck>
  );
}
