import { GetServerSideProps } from 'next';
import Head from 'next/head';
import LoginCheck from '../../../src/components/LoginCheck';
import StoreForm from '../../../src/components/StoreForm';
import { StoreDto } from '../../../src/dto';
import { AuthServer } from '../../../src/function/request';

interface EditStoreProps {
  data: StoreDto;
}

export default function EditStore({ data }: EditStoreProps) {
  return (
    <>
      <Head>
        <title>세차새차 - 매장 정보 수정</title>
      </Head>
      <LoginCheck>
        <StoreForm data={data} />
      </LoginCheck>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<EditStoreProps> = async (context) => {
  const slug = context.params?.slug;
  if (slug) {
    return await new AuthServer(context).get(`/provider/${slug}/store`, (response) => {
      const data: StoreDto | undefined = response?.data;
      console.debug(`GET /provider/${slug}/store`, data);
      if (data) {
        return { props: { data: data } };
      } else {
        throw Error('data 전송되지 않음');
      }
    });
  } else {
    throw new Error('slug 주어지지 않음');
  }
};
