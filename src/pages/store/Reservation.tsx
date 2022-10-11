import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Accordion, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Navigate, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Seperator from '../../components/Seperator';
import styles from './Reservation.module.scss';

const tempData = {
  title: '외부 세차',
  detail: `세차에 대한 설명
두줄 정도 표시할까 생각중`,
  price: 80000,
};

function Reservation() {
  const { slug, number } = useParams();
  const [carNumber, setCarNumber] = useState('');
  const [brand, setBrand] = useState('');
  const [carText, setCarText] = useState('모두');

  function onBrandChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const index = e.target.selectedIndex;
    const text = e.target.options[index].text;

    if (index !== 0) {
      setBrand(text);
      getCar(value);
    }
  }

  /**
   * 차 모델이 바뀌었을 때
   */
  function onCarChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const index = e.target.selectedIndex;
    const text = e.target.options[index].text;

    if (index === 0) {
      setCarText('모두');
    } else {
      setCarNumber(value);
      setCarText(`${brand} ${text}`);
    }
  }

  /**
   * 차 모델을 받아오는 함수
   */
  function getCar(brandNumber: string) {
    console.log('getCar()');
  }

  if (!slug || !number) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Header type={1} />

      <div className={styles.store}>
        <div className={styles.image_container}>
          <img
            src="/style_carcare.jpg"
            alt="menu_image"
            className={styles.image}
          />
        </div>
        <div className={styles.menu_info}>
          <div className={styles.menu_title}>{tempData.title}</div>
          <div className={styles.menu_detail}>{tempData.detail}</div>
        </div>
      </div>

      <div className={styles.price}>
        <div className={styles.price_title}>가격</div>
        <div className={styles.price_value}>
          {Intl.NumberFormat().format(tempData.price)}원
        </div>
      </div>

      <Seperator />

      <Accordion flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <div className={styles.option_header}>추가옵션 선택</div>
          </Accordion.Header>
          <Accordion.Body>
            <div className={styles.option_body}>Hello World!!</div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Seperator />

      <div className={styles.date}>
        <div className={styles.date_title}>예약날짜 선택</div>
        <Link
          to={`/store/${slug}/menu/${number}/time`}
          className={styles.date_input}
        >
          예약 날짜를 선택해주세요
        </Link>
      </div>

      <Seperator />

      <div className={styles.car}>
        <div className={styles.car_title}>차량 선택</div>
        <div className={styles.select_wrapper}>
          <select className={styles.select} onChange={onBrandChange}>
            <option value="select">브랜드 선택</option>
            <option value="0">현대</option>
            <option value="1">제네시스</option>
            <option value="2">쉐보레</option>
            <option value="3">GM</option>
          </select>
          <select className={styles.select} onChange={onCarChange}>
            <option value="select">모델 선택</option>
            <option value="0">EF쏘나타</option>
            <option value="1">i30</option>
            <option value="2">i40</option>
            <option value="3">LF쏘나타</option>
            <option value="4">NF쏘나타</option>
            <option value="5">YF쏘나타</option>
          </select>
        </div>
      </div>

      <Seperator />

      <div className={styles.request}>
        <div className={styles.request_title}>요청사항</div>
        <textarea className={styles.request_input}></textarea>
      </div>

      <div className={styles.result}>
        <div className={styles.result_price}>
          <div className={styles.result_price_title}>총 결제 금액</div>
          <div className={styles.result_price_value}>
            {Intl.NumberFormat().format(tempData.price)}원
          </div>
        </div>
        <Button className={styles.result_submit}>예약하기</Button>
      </div>
    </>
  );
}

export default Reservation;
