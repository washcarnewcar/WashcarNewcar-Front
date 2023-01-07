import classNames from 'classnames';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, Container, ListGroup, ListGroupItem } from 'react-bootstrap';
import { IoAdd } from 'react-icons/io5';
import LoginCheck from '../../../../src/components/LoginCheck';
import TempImage from '../../../../src/components/TempImage';
import { MenuListDto } from '../../../../src/dto';
import { authClient } from '../../../../src/function/request';

export default function MenuList() {
  const router = useRouter();
  const { slug } = router.query;
  const [menus, setMenus] = useState<MenuListDto[]>([]);

  useEffect(() => {
    if (!router.isReady) return;

    const getMenuList = async () => {
      const response = await authClient.get(`/provider/${slug}/menu`);
      console.debug(`GET /provider/${slug}/menu`, response?.data);
      const menus: MenuListDto[] | undefined = response?.data?.menu;
      if (menus) {
        setMenus(menus);
      }
    };

    if (slug) {
      getMenuList();
    }
  }, [router.isReady]);

  return (
    <>
      <Head>
        <title>세차새차 - 메뉴 관리</title>
      </Head>
      <LoginCheck>
        <Container className="pt-4">
          <h3 className="fw-bold">메뉴 관리</h3>
          <Button
            className="mt-3 d-flex align-items-center"
            onClick={() => {
              router.push(`/provider/${slug}/menu/new`);
            }}
          >
            <IoAdd size={20} className="me-1" />
            메뉴 추가
          </Button>
          <ListGroup className="mt-3">
            {menus.map((menu, index) => (
              <MenuItem data={menu} key={index} />
            ))}
          </ListGroup>
        </Container>
      </LoginCheck>
    </>
  );
}

interface MenuItemProps {
  data: MenuListDto;
}

function MenuItem({ data }: MenuItemProps) {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <ListGroupItem action>
      <Link
        href={`/provider/${slug}/menu/${data.number}`}
        className="text-decoration-none text-black d-flex align-items-center"
      >
        <div className="d-flex align-items-center justify-content-center rounded overflow-hidden flex-shrink-0 position-relative tw-bg-gray-200 tw-h-[100px] tw-w-[100px]">
          {data.image ? (
            <Image
              fill
              sizes="100px"
              className="tw-object-cover"
              src={process.env.NEXT_PUBLIC_S3_URL + data.image}
              alt=""
            />
          ) : (
            <TempImage width={50} height={50} />
          )}
        </div>
        <div className="ms-3 d-flex flex-column justify-content-between tw-min-h-[100px]">
          <div>
            <div className="fs-3 fw-bold">{data.name}</div>
            <div className="tw-text-gray-600">{data.description}</div>
          </div>
          <div className="fw-bold">{data.price.toLocaleString()}원</div>
        </div>
      </Link>
    </ListGroupItem>
  );
}
