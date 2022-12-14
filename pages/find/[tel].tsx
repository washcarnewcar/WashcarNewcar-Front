import axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import Header from '../../src/components/Header';
import Seperator from '../../src/components/Seperator';
import styles from '../../styles/FindList.module.scss';

const mockData = [
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
  const router = useRouter();
  const { tel } = router.query;

  useEffect(() => {
    axios.get('/find', { params: { tel: tel } });
  }, []);

  return (
    <>
      <Head>
        <title>세차새차 - 세차 예약 확인</title>
      </Head>
      <Header />
      <div className={styles.container}>
        <div className={styles.title}>예약한 세차</div>
        <div className={styles.blank} />

        <FindListItem data={mockData} />
        <Seperator />
        <FindListItem data={mockData} />
        <Seperator />
        <FindListItem data={mockData} />
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
    <Link href={`/reservation/1`} className={styles.item_container}>
      <div className={styles.item_left}>
        <div className={styles.item_date}>2022.9.6(화) 16:00</div>
        <div className={styles.item_info}>
          <Image src="/style_carcare.jpg" alt="스타일 카케어" width={65} height={65} className={styles.item_image} />
          <div className={styles.item_info_text}>
            <div className={styles.item_menu}>외부세차</div>
            <div className={styles.item_store}>스타일 카케어</div>
            <div className={styles.item_car}>기아 EV6 / 31하 1450</div>
          </div>
        </div>
      </div>
      <div className={styles.item_right}>
        <div className={styles.item_state}>확인중</div>
        <IoIosArrowForward size={30} />
      </div>
    </Link>
  );
}
