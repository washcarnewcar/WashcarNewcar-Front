import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { IoAdd } from 'react-icons/io5';
import Header from '../../../../components/header';
import styles from '../../../../styles/MenuEdit.module.scss';

const tempData = {
  menu: [
    {
      number: 1,
      image: 'S3 URL',
      name: '외부 세차',
      detail:
        '세차에 대한 설명dfasffsdfsdfdsfs\n두줄 정도 표시할까 ㅇ라넝라너dfsafdsds',
      price: 80000,
    },
    {
      number: 2,
      image: 'S3 URL',
      name: '내부 세차',
      detail: '세차에 대한 설명\n두줄 정도 표시할까 생각중',
      price: 70000,
    },
    {
      number: 3,
      image: 'S3 URL',
      name: '내부 세차',
      detail: '한줄은 어때요?',
      price: 70000,
    },
  ],
};

export default function MenuEdit() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <>
      <Header type={1} />
    </>
  );
}
