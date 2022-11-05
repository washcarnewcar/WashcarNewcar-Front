import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'moment/locale/ko';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
