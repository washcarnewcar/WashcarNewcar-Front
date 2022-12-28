import Head from 'next/head';
import LoginCheck from '../../../../src/components/LoginCheck';
import MenuForm from '../../../../src/components/MenuForm';

export default function MenuNew() {
  return (
    <>
      <Head>
        <title>세차새차 - 메뉴 추가</title>
      </Head>
      <LoginCheck>
        <MenuForm data={null} />
      </LoginCheck>
    </>
  );
}
