import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import LoginCheck from '../../../../src/components/LoginCheck';
import MenuForm from '../../../../src/components/MenuForm';
import { MenuDto } from '../../../../src/dto';
import { client } from '../../../../src/function/request';

const mockData = {
  image: 'storeImages/00664fef-064a-4170-aae6-12607e7e84a63D_map4.png',
  name: '외부세차',
  description: '세차에 대한 설명',
  price: 10000,
  expected_hour: 2,
  expected_minute: 30,
};

export default function MenuEdit() {
  const router = useRouter();
  const { slug, number } = router.query;
  const [menu, setMenu] = useState<MenuDto | undefined>();

  const getData = useCallback(async () => {
    if (slug && number) {
      const response = await client.get(`/store/${slug}/menu/${number}`);
      console.log(response.data);
      // const menu: MenuDto | undefined = response?.data;
      const menu: MenuDto | undefined = mockData;
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
      <MenuForm slug={slug as string} number={number as string} data={menu} />
    </LoginCheck>
  );
}
