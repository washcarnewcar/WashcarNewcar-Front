import Head from 'next/head';
import Link from 'next/link';
import Header from '../src/components/Header';
import styles from '../styles/Home.module.scss';

export default function Home() {
  return (
    <>
      <Head>
        <title>세차새차 - 손세차 중계 플랫폼</title>
      </Head>
      <Header type={1} />
      <div className={styles.card_grid}>
        <Link className={styles.card_grid_item} href="/search">
          <div className={styles.card_title}>세차하기</div>
          <div className={styles.card_content}>내 주변 세차장 찾기</div>
        </Link>
        <Link className={styles.card_grid_item} href="/find">
          <div className={styles.card_title}>예약 확인하기</div>
        </Link>
        <Link className={styles.card_grid_item} href="/provider">
          <div className={styles.card_title}>매장 관리하기</div>
          <div className={styles.card_content}>세차장 사장님이신가요?</div>
        </Link>
      </div>
    </>
  );
}
