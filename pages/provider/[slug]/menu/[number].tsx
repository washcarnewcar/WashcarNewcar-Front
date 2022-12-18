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
    const getData = async () => {
      if (slug && number) {
        const response = await authClient.get(`/provider/menu/${number}`);
        console.debug(`GET /provider/menu/${number}`);
        console.debug(response?.data);
        const menu: MenuDto | undefined = response?.data;
        if (menu) {
          setMenu(menu);
        }
      }
    };
    getData();
  }, [slug, number]);

  return (
    <LoginCheck>
      <MenuForm data={menu} />
    </LoginCheck>
  );
}
