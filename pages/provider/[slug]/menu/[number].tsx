import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import Header from '../../../../src/components/Header';
import LoginCheck from '../../../../src/components/LoginCheck';
import MenuForm from '../../../../src/components/MenuForm';
import { MenuDto } from '../../../../src/dto';
import { client } from '../../../../src/function/request';

export default function MenuEdit() {
  const router = useRouter();
  const { slug, number } = router.query;
  const [menu, setMenu] = useState<MenuDto | undefined>();

  const getData = useCallback(async () => {
    if (slug && number) {
      const response = await client.get(`/store/${slug}/menu/${number}`);
      console.log(response.data);
      const menu: MenuDto | undefined = response?.data;
      if (menu) {
        setMenu(menu);
      }
    }
  }, [number, slug]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <LoginCheck>
      <MenuForm slug={slug as string} data={menu} />
    </LoginCheck>
  );
}
