import { GetServerSideProps } from 'next';
import { AuthRequst } from '../../src/function/request';

export default function ProviderCheck() {}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await new AuthRequst(context).get(`/provider/slug`, (response) => {
    const status = response?.data?.status;
    const slug = response?.data?.slug;
    if (status) {
      switch (status) {
        // slug 존재
        case 2600:
          return { redirect: { destination: `/provider/${slug}`, statusCode: 302 } };
        // 세차장 만들지 않음
        case 2601:
          return { redirect: { destination: `/provider/new`, statusCode: 302 } };
        default:
          return { redirect: { destination: `/error`, statusCode: 302 } };
      }
    } else {
      return { redirect: { destination: `/error`, statusCode: 302 } };
    }
  });
};
