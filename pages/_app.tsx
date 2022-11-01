import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'moment/locale/ko';
import type { AppProps } from 'next/app';
import Script from 'next/script';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_APPKEY}&libraries=services,clusterer&autoload=false`}
        strategy="beforeInteractive"
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
