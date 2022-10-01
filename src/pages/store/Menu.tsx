import { Accordion, Button } from 'react-bootstrap';
import { Navigate, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Seperator from '../../components/Seperator';
import styles from './Menu.module.scss';

const tempData = {
  title: '외부 세차',
  detail: `세차에 대한 설명
두줄 정도 표시할까 생각중`,
  price: 80000,
};

const Menu = () => {
  const { slug, number } = useParams();

  if (!slug || !number) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Header type={1} />
      {/* {slug} 가게의 {number} 메뉴번호 */}

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
        <div className={styles.date_input}>예약 날짜를 선택해주세요</div>
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
};

export default Menu;
