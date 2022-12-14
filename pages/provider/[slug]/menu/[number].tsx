import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LoginCheck from '../../../../src/components/LoginCheck';
import MenuForm from '../../../../src/components/MenuForm';
import { MenuDto } from '../../../../src/dto';
import { authClient } from '../../../../src/function/request';

export default function MenuEdit() {
  const router = useRouter();
  const { slug, number } = router.query;
  const [menu, setMenu] = useState<MenuDto | undefined>();

  useEffect(() => {
    if (!router.isReady) return;

    const getData = async () => {
      const response = await authClient.get(`/provider/menu/${number}`);
      console.debug(`GET /provider/menu/${number}`, response?.data);
      const menu: MenuDto | undefined = response?.data;
      if (menu) {
        setMenu(menu);
      }
    };

    if (slug && number) {
      getData();
    }
  }, [router.isReady]);

  return (
    <>
      <Head>
        <title>세차새차 - 메뉴 수정</title>
      </Head>
      <LoginCheck>
        <MenuForm data={menu} />
      </LoginCheck>
    </>
  );
}
