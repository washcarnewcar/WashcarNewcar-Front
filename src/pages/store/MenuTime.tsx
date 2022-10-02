import classNames from 'classnames';
import moment from 'moment';
import 'moment/locale/ko';
import { useState } from 'react';
import { Accordion, Button } from 'react-bootstrap';
import Datepicker from '../../components/Datepicker';
import Header from '../../components/Header';
import styles from './MenuTime.module.scss';

const amTimeList = [
  { time: '00:00', available: false },
  { time: '00:30', available: false },
  { time: '01:00', available: false },
  { time: '01:30', available: false },
  { time: '02:00', available: false },
  { time: '02:30', available: false },
  { time: '03:00', available: false },
  { time: '03:30', available: false },
  { time: '04:00', available: false },
  { time: '04:30', available: false },
  { time: '05:00', available: false },
  { time: '05:30', available: true },
  { time: '06:00', available: true },
  { time: '06:30', available: true },
  { time: '07:00', available: true },
  { time: '07:30', available: true },
  { time: '08:00', available: true },
  { time: '08:30', available: true },
  { time: '09:00', available: true },
  { time: '09:30', available: true },
  { time: '10:00', available: true },
  { time: '10:30', available: true },
  { time: '11:00', available: true },
  { time: '11:30', available: true },
];

const pmTimeList = [
  { time: '12:00', available: true },
  { time: '12:30', available: true },
  { time: '13:00', available: true },
  { time: '13:30', available: true },
  { time: '14:00', available: true },
  { time: '14:30', available: true },
  { time: '15:00', available: true },
  { time: '15:30', available: true },
  { time: '16:00', available: true },
  { time: '16:30', available: true },
  { time: '17:00', available: true },
  { time: '17:30', available: true },
  { time: '18:00', available: true },
  { time: '18:30', available: false },
  { time: '19:00', available: false },
  { time: '19:30', available: false },
  { time: '20:00', available: false },
  { time: '20:30', available: false },
  { time: '21:00', available: false },
  { time: '21:30', available: false },
  { time: '22:00', available: false },
  { time: '22:30', available: false },
  { time: '23:00', available: false },
  { time: '23:30', available: false },
];

function MenuTime() {
  const [date, setDate] = useState(new Date());

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
          <Accordion flush>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <div className={styles.time_am_title}>오전</div>
              </Accordion.Header>
              <Accordion.Body>
                <div className={styles.time_grid}>
                  {amTimeList.map((amTime) => {
                    if (amTime.available)
                      return (
                        <Button
                          variant="outline-primary"
                          className={classNames(
                            styles.time_item,
                            styles.time_item_available
                          )}
                        >
                          {amTime.time}
                        </Button>
                      );
                    else {
                      return (
                        <Button
                          variant="outline-secondary"
                          disabled={true}
                          className={classNames(
                            styles.time_item,
                            styles.time_item_unavailable
                          )}
                        >
                          {amTime.time}
                        </Button>
                      );
                    }
                  })}
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <div className={styles.time_am_title}>오후</div>
              </Accordion.Header>
              <Accordion.Body>
                <div className={styles.time_grid}>
                  {pmTimeList.map((pmTime) => {
                    if (pmTime.available)
                      return (
                        <Button
                          variant="outline-primary"
                          className={classNames(
                            styles.time_item,
                            styles.time_item_available
                          )}
                        >
                          {pmTime.time}
                        </Button>
                      );
                    else {
                      return (
                        <Button
                          variant="outline-secondary"
                          disabled={true}
                          className={classNames(
                            styles.time_item,
                            styles.time_item_unavailable
                          )}
                        >
                          {pmTime.time}
                        </Button>
                      );
                    }
                  })}
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>

      <div className={styles.result}>
        <div className={styles.result_date}>
          {moment().format('MM월 D일 a h시 mm분')}
        </div>
        <Button className={styles.result_submit}>선택</Button>
      </div>
    </>
  );
}

export default MenuTime;
