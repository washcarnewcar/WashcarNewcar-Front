import Header from '../../../components/header';
import styles from '../../../styles/MenuEdit.module.scss';

export default function Menu() {
  return (
    <>
      <Header type={1} />
      <div>
        <div className={styles.title}>메뉴 관리</div>
      </div>
    </>
  );
}
