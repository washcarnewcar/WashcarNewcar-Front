import Header from '../components/Header';
import styles from './Index.module.scss';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <>
      <Header type={1} />
      <div className={styles.card_grid}>
        <Link to="/search" className={styles.card_grid_item}>
          <div className={styles.card_title}>세차하기</div>
          <div className={styles.card_content}>내 주변 세차장 찾기</div>
        </Link>
        <Link to="/find" className={styles.card_grid_item}>
          <div className={styles.card_title}>예약 확인하기</div>
        </Link>
        <Link to="/provider" className={styles.card_grid_item}>
          <div className={styles.card_title}>매장 관리하기</div>
          <div className={styles.card_content}>세차장 사장님이신가요?</div>
        </Link>
      </div>
    </>
  );
};

export default Index;
