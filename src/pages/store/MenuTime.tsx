import Datepicker from '../../components/Datepicker';
import Header from '../../components/Header';
import styles from './MenuTime.module.scss';

function MenuTime() {
  return (
    <>
      <Header type={1} />
      <div className={styles.date}>
        <div className={styles.date_title}>날짜 선택</div>
        <Datepicker />
      </div>
      <div className={styles.time}>
        <div className={styles.time_title}>시간 선택</div>
        <div className={styles.time_content}>
          <div className={styles.time_am}>오전</div>
          <div className={styles.time_pm}>오후</div>
        </div>
      </div>
    </>
  );
}

export default MenuTime;
