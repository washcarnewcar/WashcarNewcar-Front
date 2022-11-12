import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { IoAdd } from 'react-icons/io5';
import Header from '../../../../src/components/Header';
import styles from '../../../../styles/MenuList.module.scss';

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

export default function MenuList() {
  const router = useRouter();
  const { slug } = router.query;

  const getMenuList = () => {};

  useEffect(() => {
    getMenuList();
  }, []);

  return (
    <>
      <Header type={1} />
      <div className={styles.container}>
        <div className={styles.title}>메뉴 관리</div>
        <div className={styles.plus_button_wrapper}>
          <Link href={`/provider/${slug}/menu/new`}>
            <Button className={styles.plus_button}>
              <IoAdd size={20} className={styles.plus_icon} />
              메뉴 추가
            </Button>
          </Link>
        </div>
        <ListGroup>
          {tempData.menu.map((menuItem, index) => (
            <ListGroupItem key={index}>
              <MenuItem slug={slug as string} data={menuItem} />
            </ListGroupItem>
          ))}
        </ListGroup>
      </div>
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

interface MenuItemProps {
  data: IData;
  slug: string;
}

function MenuItem({ data, slug }: MenuItemProps) {
  return (
    <Link href={`/provider/${slug}/menu/${data.number}`}>
      <a className={styles.link}>
        <div className={styles.link_container}>
          <div className={styles.image_wrapper}>
            <Image
              width={90}
              height={90}
              className={styles.image}
              src="/style_carcare.jpg"
              alt="menu_image"
            />
          </div>
          <div className={styles.content}>
            <div className={styles.menu_title}>{data.name}</div>
            <div className={styles.menu_detail}>{data.detail}</div>
            <div className={styles.menu_price}>
              {data.price.toLocaleString()}원
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}
