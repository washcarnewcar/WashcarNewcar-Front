import styles from './Search.module.scss';
import Datepicker from '../../components/Datepicker';
import { IoIosArrowForward } from 'react-icons/io';
import { BsCheckCircleFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import Item from '../../components/Item';
import classNames from 'classnames';
import Header from '../../components/Header';
import { Accordion } from 'react-bootstrap';
import { NONAME } from 'dns';

const Search = () => {
  return (
    <>
      <Header type={1} />
      <div className={styles.container}>
        <Accordion flush>
          <Accordion.Item eventKey="0" className={styles.select_car_item}>
            <Accordion.Header>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginRight: '10px',
                }}
              >
                <div style={{ fontSize: 'large', fontWeight: 'bolder' }}>
                  차량 선택
                </div>
                <div>(대충 차 이름)</div>
              </div>
            </Accordion.Header>
            <Accordion.Body>어쩌고 저쩌고</Accordion.Body>
          </Accordion.Item>
          <hr className={styles.seperator} />
        </Accordion>
        <Link
          to="/search/map"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 16,
            paddingBottom: 16,
            textDecoration: 'none',
            color: 'black',
          }}
        >
          <div style={{ fontSize: 'large', fontWeight: 'bolder' }}>
            검색 위치
          </div>
          <IoIosArrowForward size={23} />
        </Link>

        {/* <div className={styles.flex_container}>
          <div className={styles.left}>차량 선택</div>
          <div className={styles.right}>
            <IoIosArrowForward size={30} />
          </div>
        </div>
        <hr className={styles.seperator} />

        <div className={styles.flex_container}>
          <div className={styles.left}>지역 선택</div>
          <div className={styles.right}>
            서울 강남구
            <IoIosArrowForward size={30} />
          </div>
        </div> */}

        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
      </div>
    </>
  );
};

export default Search;
