import { useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { IoIosArrowForward } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { isTemplateExpression } from 'typescript';
import Header from '../../components/Header';
import Seperator from '../../components/Seperator';
import styles from './FindList.module.scss';

const tempData = [
  {
    status: 'request', // 예약 요청 대기중인 상태
    reservation_number: 1, // 예약 번호
    car_model: '기아 EV6', // 차 모델
    car_number: '31하 1450', // 차번호
    store: '스타일 카케어', // 세차장 이름
    preview_image: 'S3 주소', // 메뉴 미리보기 이미지
    menu: '세차 이름', // 메뉴 이름
    date: 'date 객체', // 예약일
  },
  {
    status: 'reservation', // 사장님이 예약을 승인하여, 예약이 완료된 상태
    reservation_number: 2, // 예약 번호
    car_model: '기아 EV6', // 차 모델
    car_number: '31하 1450', // 차번호
    store: '스타일 카케어', // 세차장 이름
    preview_image: 'S3 주소', // 메뉴 미리보기 이미지
    menu: '세차 이름', // 메뉴 이름
    date: 'date 객체', // 예약일
  },

  // reject = 거부 = 사장님이 예약 거부
  // cancel = 취소 = 고객님이 예약 취소
  {
    status: 'reject', // 예약 요청 대기중에 거부한 세차
    reservation_number: 3, // 예약 번호
    car_model: '기아 EV6', // 차 모델
    car_number: '31하 1450', // 차번호
    store: '스타일 카케어', // 세차장 이름
    preview_image: 'S3 주소', // 메뉴 미리보기 이미지
    menu: '세차 이름', // 메뉴 이름
    date: 'date 객체', // 예약일
  },

  //
  {
    status: 'cancel', // 예약 요청 대기중에 취소한 세차
    reservation_number: 5, // 예약 번호 null
    car_model: '기아 EV6', // 차 모델
    car_number: '31하 1450', // 차번호
    store: '스타일 카케어', // 세차장 이름
    preview_image: 'S3 주소', // 메뉴 미리보기 이미지
    menu: '세차 이름', // 메뉴 이름
    date: 'date 객체', // 예약일
  },

  // 세차 완료
  {
    status: 'complete', // 세차 완료
    reservation_number: 7, // 예약 번호
    car_model: '기아 EV6', // 차 모델
    car_number: '31하 1450', // 차번호
    store: '스타일 카케어', // 세차장 이름
    preview_image: 'S3 주소', // 메뉴 미리보기 이미지
    menu: '세차 이름', // 메뉴 이름
    date: 'date 객체', // 예약일
  },
];

export default function FindList() {
  const { phone } = useParams();

  return (
    <>
      <Header type={1} />
      <div className={styles.container}>
        <div className={styles.title}>예약한 세차</div>
        <div className={styles.blank} />

        <FindListItem data={tempData} />
        <Seperator />
        <FindListItem data={tempData} />
        <Seperator />
        <FindListItem data={tempData} />
        <Seperator />
      </div>
    </>
  );
}

interface FindListItemProps {
  data: object[];
}

function FindListItem({ data }: FindListItemProps) {
  return (
    <Link to={`/reservation/1`} className={styles.item_container}>
      <div className={styles.left}>
        <div className={styles.date}>2022.9.6(화) 16:00</div>
        <div className={styles.info}>
          <img
            src="/style_carcare.jpg"
            alt="스타일 카케어"
            className={styles.image}
          />
          <div className={styles.info_text}>
            <div className={styles.menu}>외부세차</div>
            <div className={styles.store}>스타일 카케어</div>
            <div className={styles.car}>기아 EV6 / 31하 1450</div>
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.state}>확인중</div>
        <IoIosArrowForward size={30} />
      </div>
    </Link>
  );
}
