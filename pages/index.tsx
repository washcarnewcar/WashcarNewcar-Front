import Link from 'next/link';
import Header from '../src/components/Header';
import styles from '../styles/Home.module.scss';

export default function Home() {
  return (
    <>
      <Header type={1} />
      <div className={styles.card_grid}>
        <Link href="/search">
          <a className={styles.card_grid_item}>
            <div className={styles.card_title}>세차하기</div>
            <div className={styles.card_content}>내 주변 세차장 찾기</div>
          </a>
        </Link>
        <Link href="/find">
          <a className={styles.card_grid_item}>
            <div className={styles.card_title}>예약 확인하기</div>
          </a>
        </Link>
        <Link href="/provider">
          <a className={styles.card_grid_item}>
            <div className={styles.card_title}>매장 관리하기</div>
            <div className={styles.card_content}>세차장 사장님이신가요?</div>
          </a>
        </Link>
      </div>
    </>
  );
}
