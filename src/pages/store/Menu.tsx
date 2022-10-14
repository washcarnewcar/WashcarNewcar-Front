import classNames from 'classnames';
import moment from 'moment';
import { useState } from 'react';
import { Accordion, Button, Form } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Seperator from '../../components/Seperator';
import styles from './Menu.module.scss';

const tempData = {
  title: '외부 세차',
  detail: `세차에 대한 설명
두줄 정도 표시할까 생각중`,
  price: 80000,
};

const tempBrandData = {
  brand: [
    {
      number: 0,
      name: '현대',
    },
    {
      number: 1,
      name: '제네시스',
    },
    {
      number: 2,
      name: '기아',
    },
    {
      number: 3,
      name: '쉐보레',
    },
  ],
};

const tempModelData = {
  model: [
    {
      number: 0,
      name: 'EF쏘나타',
    },
    {
      number: 1,
      name: 'i30',
    },
    {
      number: 2,
      name: 'i40',
    },
    {
      number: 3,
      name: 'LF쏘나타',
    },
  ],
};

function Menu() {
  const location = useLocation();
  const { slug, number } = useParams();
  const [brands, setBrands] = useState([{ number: 0, name: '' }]);
  const [models, setModels] = useState([{ number: 0, name: '' }]);
  const [selectedBrandNumber, setSelectedBrandNumber] = useState('');
  const [selectedCarNumber, setSelectedCarNumber] = useState('');
  const [isSelectedDate, setIsSelectedDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [carrier, setCarrier] = useState('');
  const [mobile, setMobile] = useState('');

  useState(() => {
    judgeSelectedDate();
    getBrand();

    /**
     * 날짜 선택 페이지에서 날짜를 선택했는지 판단
     */
    function judgeSelectedDate() {
      if (location.state?.selectedDate) {
        setIsSelectedDate(true);
        setSelectedDate(location.state.selectedDate);
      } else {
        setIsSelectedDate(false);
      }
    }

    function getBrand() {
      setBrands(tempBrandData.brand);
    }
  });

  function onBrandChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const index = e.target.selectedIndex;
    const text = e.target.options[index].text;

    if (index !== 0) {
      setSelectedBrandNumber(value);
      getCars(value);
    }
  }

  /**
   * 차 모델이 바뀌었을 때
   */
  function onCarChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const index = e.target.selectedIndex;
    const text = e.target.options[index].text;

    if (index !== 0) {
      setSelectedCarNumber(value);
    }
  }

  /**
   * 차 모델을 받아오는 함수
   */
  function getCars(brandNumber: string) {
    console.log(`getCar(${brandNumber})`);
    setModels(tempModelData.model);
  }

  function onCarrierSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    console.log(e.target.value);
    setCarrier(e.target.value);
  }

  function onMobileSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    console.log(e.target.value);
    setMobile(e.target.value);
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

      <div className={styles.element}>
        <div className={styles.element_title}>예약날짜 선택</div>
        <Link
          to={`/store/${slug}/menu/${number}/time`}
          className={classNames(styles.date_input, {
            [styles.date_input_selected]: isSelectedDate,
            [styles.date_input_unselected]: !isSelectedDate,
          })}
        >
          {isSelectedDate
            ? moment(selectedDate).format('MM월 D일 a h시 mm분')
            : '예약 날짜를 선택해주세요'}
        </Link>
      </div>

      <Seperator />

      <div className={styles.element}>
        <div className={styles.element_title}>차량 선택</div>
        <div className={styles.select_wrapper}>
          <Form.Select className={styles.select} onChange={onBrandChange}>
            <option value="select">브랜드 선택</option>
            {brands.map((brand) => (
              <option key={brand.number} value={brand.number}>
                {brand.name}
              </option>
            ))}
          </Form.Select>
          <Form.Select className={styles.select} onChange={onCarChange}>
            <option value="select">모델 선택</option>
            {models.map((model) => (
              <option key={model.number} value={model.number}>
                {model.name}
              </option>
            ))}
          </Form.Select>
        </div>
      </div>

      <Seperator />

      <div className={styles.element}>
        <div className={styles.element_title}>휴대폰 번호</div>
        <Form.Control
          type="tel"
          className={styles.phone}
          placeholder="휴대폰 번호"
        />
      </div>

      <Seperator />

      <div className={styles.request}>
        <div className={styles.request_title}>요청사항</div>
        <Form.Control
          as="textarea"
          className={styles.request_input}
        ></Form.Control>
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

export default Menu;
