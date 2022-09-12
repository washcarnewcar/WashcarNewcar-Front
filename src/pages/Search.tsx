import styles from './Search.module.scss';
import Datepicker from '../components/Datepicker';
import { IoIosArrowForward } from 'react-icons/io';
import { BsCheckCircleFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import Item from '../components/Item';
import classNames from 'classnames';
import Header from '../components/Header';

const Search = () => {
  return (
    <div className={styles.container}>
      <Header type={2} />
      <div className={styles.date}>
        <div className={styles.date_flex_container}>
          <div className={styles.left}>날짜 선택</div>
        </div>
        <Datepicker />
      </div>

      <div className={styles.flex_container}>
        <div className={styles.left}>지역 선택</div>
        <div className={styles.right}>
          서울 강남구
          <IoIosArrowForward size={30} />
        </div>
      </div>

      <div
        className={classNames(
          styles.flex_container,
          styles.time_flex_container
        )}
      >
        <div className={styles.left}>시간 선택</div>
        <div className={styles.right}>
          <BsCheckCircleFill className={styles.check_icon} />
          당일 가능 업체만
          <IoIosArrowForward size={30} />
        </div>
      </div>

      <Item />
      <Item />
      <Item />
      <Item />
      <Item />
    </div>
  );
};

export default Search;
