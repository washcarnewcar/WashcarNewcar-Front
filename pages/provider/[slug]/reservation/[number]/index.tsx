import classNames from 'classnames';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Button, Form, ListGroup } from 'react-bootstrap';
import Header from '../../../../../components/header';
import styles from '../../../../../styles/ProviderReservation.module.scss';

export default function ProviderReservation() {
  const router = useRouter();
  const { slug, number } = router.query;
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');

  function onSelectHour(e: React.ChangeEvent<HTMLSelectElement>) {
    setHour(e.target.value);
  }

  function onSelectMinute(e: React.ChangeEvent<HTMLSelectElement>) {
    setMinute(e.target.value);
  }

  function generateHour() {
    let dom = [];
    for (let i = 0; i <= 12; i++) {
      dom.push(
        <option value={i} key={i}>
          {i}
        </option>
      );
    }
    return dom;
  }

  function generateMinute() {
    let dom = [];
    for (let i = 0; i <= 30; i += 5) {
      dom.push(
        <option value={i} key={i}>
          {i}
        </option>
      );
    }
    return dom;
  }

  return (
    <>
      <Header type={1} />
      <div className={styles.container}>
        <div className={styles.info_container}>
          <ListGroup>
            <ListGroup.Item className={classNames(styles.list, styles.title)}>
              예약 요청 정보
            </ListGroup.Item>
            <ListGroup.Item className={classNames(styles.list, styles.detail)}>
              <table>
                <tbody>
                  <tr>
                    <td className={styles.head}>차량</td>
                    <td className={styles.content}>
                      기아 EV6
                      <br />
                      31하 1450
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.head}>세차장</td>
                    <td
                      className={styles.content}
                    >{`루페스 디테일링 센터 인천논현점`}</td>
                  </tr>
                  <tr>
                    <td className={styles.head}>세차종류</td>
                    <td className={styles.content}>{`외부 세차`}</td>
                  </tr>
                  <tr>
                    <td className={styles.head}>일정</td>
                    <td className={styles.content}>
                      {moment().format('YYYY.MM.DD(dd) a HH:mm')}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.head}>예상시간</td>
                    <td className={styles.content}>
                      {moment().format('H시간 mm분')}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.head}>거부 사유</td>
                    <td className={styles.content}>
                      저희 세차장에서는 해당 차를 세차할 수 있는 공간이
                      없습니다.
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.head}>취소 사유</td>
                    <td className={styles.content}>잘못 예약했습니다.</td>
                  </tr>
                  <tr>
                    <td className={styles.head}>완료 시간</td>
                    <td className={styles.content}>
                      {moment().format('YYYY.MM.DD(dd) a HH:mm')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </ListGroup.Item>
          </ListGroup>

          <div className={styles.predict_container}>
            <div className={styles.predict_title}>예상 세차 시간</div>
            <div className={styles.predict}>
              <div className={styles.hour}>
                <Form.Select className={styles.select} onChange={onSelectHour}>
                  {generateHour()}
                </Form.Select>
                <div className={styles.text}>시간</div>
              </div>
              <div className={styles.minute}>
                <Form.Select
                  className={styles.select}
                  onChange={onSelectMinute}
                >
                  {generateMinute()}
                </Form.Select>
                <div className={styles.text}>분</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.button_container}>
          <Link href={`/provider/${slug}/reservation/${number}/reject`}>
            <Button variant="danger" className={styles.button}>
              요청 거부
            </Button>
          </Link>
          <Link href={`/reservation/1`}>
            <Button className={styles.button}>요청 확인</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
