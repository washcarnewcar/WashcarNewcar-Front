import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { IoAdd } from 'react-icons/io5';
import LoginCheck from '../../../../src/components/LoginCheck';
import { MenuListDto } from '../../../../src/dto';
import { authClient } from '../../../../src/function/request';
import styles from '../../../../styles/MenuList.module.scss';

export default function MenuList() {
  const router = useRouter();
  const { slug } = router.query;
  const [menus, setMenus] = useState<MenuListDto[]>([]);

  useEffect(() => {
    const getMenuList = async () => {
      const response = await authClient.get(`/provider/${slug}/menu`);
      console.debug(`GET /provider/${slug}/menu`);
      console.debug(response?.data);
      const menus: MenuListDto[] | undefined = response?.data?.menu;
      if (menus) {
        setMenus(menus);
      }
    };

    if (slug) {
      getMenuList();
    }
  }, [slug]);

  return (
    <LoginCheck>
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
          {menus.map((menu, index) => (
            <ListGroupItem key={index}>
              <MenuItem data={menu} />
            </ListGroupItem>
          ))}
        </ListGroup>
      </div>
    </LoginCheck>
  );
}

interface MenuItemProps {
  data: MenuListDto;
}

function MenuItem({ data }: MenuItemProps) {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <Link href={`/provider/${slug}/menu/${data.number}`}>
      <a className={styles.link}>
        <div className={styles.link_container}>
          {data.image ? (
            <div className={styles.image_wrapper}>
              <Image
                width={90}
                height={90}
                className={styles.image}
                src={process.env.NEXT_PUBLIC_S3_URL + data.image}
                alt=""
              />
            </div>
          ) : (
            <div
              className={classNames(
                styles.image_wrapper,
                styles.image_wrapper_alt
              )}
            >
              <Image
                width={50}
                height={50}
                className={classNames(styles.image, styles.image_alt)}
                src="/main_logo.png"
                alt="menu"
              />
            </div>
          )}
          <div className={styles.content}>
            <div className={styles.menu_title}>{data.name}</div>
            <div className={styles.menu_description}>{data.description}</div>
            <div className={styles.menu_price}>
              {data.price.toLocaleString()}원
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}
