import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'moment/locale/ko';
import type { AppProps } from 'next/app';
import { UserProvider } from '../src/contexts/UserProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </>
  );
}

export default MyApp;
