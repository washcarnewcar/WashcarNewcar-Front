import Head from 'next/head';
import LoginCheck from '../../src/components/LoginCheck';
import StoreForm from '../../src/components/StoreForm';

export default function NewStore() {
  return (
    <>
      <Head>
        <title>세차새차 - 매장 생성</title>
      </Head>
      <LoginCheck>
        <StoreForm data={null} />
      </LoginCheck>
    </>
  );
}
