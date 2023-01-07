import { GetServerSideProps } from 'next';
import { AuthServer } from '../../src/function/request';

export default function ProviderCheck() {}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await new AuthServer(context).get(`/provider/slug`, (response) => {
    const { status, message, slug } = response?.data;
    if (status && slug) {
      switch (status) {
        // slug 존재
        case 2600:
          return { redirect: { destination: `/provider/${slug}`, statusCode: 302 } };
        // 세차장 만들지 않음
        case 2601:
          return { redirect: { destination: `/provider/new`, statusCode: 302 } };
        default:
          throw new Error(message);
      }
    } else {
      throw new Error('잘못된 응답');
    }
  });
};
