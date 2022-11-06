import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { IoAdd } from 'react-icons/io5';
import Header from '../../../../components/header';
import styles from '../../../../styles/MenuEdit.module.scss';

export default function MenuNew() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <>
      <Header type={1} />
      <div className={styles.container}></div>
    </>
  );
}

interface IData {
  image: string;
  name: string;
  detail: string;
  price: number;
  number: number;
}
