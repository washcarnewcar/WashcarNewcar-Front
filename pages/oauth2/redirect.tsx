import { GetServerSideProps } from 'next';

export default function OAuthRedirect() {}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token, refresh } = context.query;
  if (token || refresh) {
    context.res.setHeader('Set-Cookie', [
      `access_token=${token}; Path=/; Secure; HttpOnly`,
      `refresh_token=${refresh}; Path=/; Secure; HttpOnly`,
    ]);
  }
  return { redirect: { destination: '/', statusCode: 302 } };
};
