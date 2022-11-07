import classNames from 'classnames';
import moment from 'moment';
import 'moment/locale/ko';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Accordion, Button } from 'react-bootstrap';
import Datepicker from '../../../../../components/Datepicker';
import Header from '../../../../../components/Header';
import styles from '../../../../../styles/MenuTime.module.scss';

const amTimeList = [
  { time: new Date(0, 0, 0, 0, 0), available: false },
  { time: new Date(0, 0, 0, 0, 30), available: false },
  { time: new Date(0, 0, 0, 1, 0), available: false },
  { time: new Date(0, 0, 0, 1, 30), available: false },
  { time: new Date(0, 0, 0, 2, 0), available: false },
  { time: new Date(0, 0, 0, 2, 30), available: false },
  { time: new Date(0, 0, 0, 3, 0), available: false },
  { time: new Date(0, 0, 0, 3, 30), available: false },
  { time: new Date(0, 0, 0, 4, 0), available: false },
  { time: new Date(0, 0, 0, 4, 30), available: false },
  { time: new Date(0, 0, 0, 5, 0), available: false },
  { time: new Date(0, 0, 0, 5, 30), available: true },
  { time: new Date(0, 0, 0, 6, 0), available: true },
  { time: new Date(0, 0, 0, 6, 30), available: true },
  { time: new Date(0, 0, 0, 7, 0), available: true },
  { time: new Date(0, 0, 0, 7, 30), available: true },
  { time: new Date(0, 0, 0, 8, 0), available: true },
  { time: new Date(0, 0, 0, 8, 30), available: true },
  { time: new Date(0, 0, 0, 9, 0), available: true },
  { time: new Date(0, 0, 0, 9, 30), available: true },
  { time: new Date(0, 0, 0, 10, 0), available: true },
  { time: new Date(0, 0, 0, 10, 30), available: true },
  { time: new Date(0, 0, 0, 11, 0), available: true },
  { time: new Date(0, 0, 0, 11, 30), available: true },
];

const pmTimeList = [
  { time: new Date(0, 0, 0, 12, 0), available: true },
  { time: new Date(0, 0, 0, 12, 30), available: true },
  { time: new Date(0, 0, 0, 13, 0), available: true },
  { time: new Date(0, 0, 0, 13, 30), available: true },
  { time: new Date(0, 0, 0, 14, 0), available: true },
  { time: new Date(0, 0, 0, 14, 30), available: true },
  { time: new Date(0, 0, 0, 15, 0), available: true },
  { time: new Date(0, 0, 0, 15, 30), available: true },
  { time: new Date(0, 0, 0, 16, 0), available: true },
  { time: new Date(0, 0, 0, 16, 30), available: true },
  { time: new Date(0, 0, 0, 17, 0), available: true },
  { time: new Date(0, 0, 0, 17, 30), available: true },
  { time: new Date(0, 0, 0, 18, 0), available: true },
  { time: new Date(0, 0, 0, 18, 30), available: true },
  { time: new Date(0, 0, 0, 19, 0), available: false },
  { time: new Date(0, 0, 0, 19, 30), available: false },
  { time: new Date(0, 0, 0, 20, 0), available: false },
  { time: new Date(0, 0, 0, 20, 30), available: false },
  { time: new Date(0, 0, 0, 21, 0), available: false },
  { time: new Date(0, 0, 0, 21, 30), available: false },
  { time: new Date(0, 0, 0, 22, 0), available: false },
  { time: new Date(0, 0, 0, 22, 30), available: false },
  { time: new Date(0, 0, 0, 23, 0), available: false },
  { time: new Date(0, 0, 0, 23, 30), available: false },
];

const tempAvailableDays = [
  '2022-10-11',
  '2022-10-12',
  '2022-10-13',
  '2022-10-14',
  '2022-10-15',
  '2022-10-18',
  '2022-10-19',
];

function MenuTime() {
  const router = useRouter();
  const { slug, number } = router.query;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [availableDays, setAvailableDays] = useState(['']);
  const [isDaySelect, setIsDaySelect] = useState(false);

  useEffect(() => {
    getAvailableDay();

    /**
     * 가능한 시간을 불러오는 함수
     */
    function getAvailableDay() {
      setAvailableDays(tempAvailableDays);
    }
  }, []);

  function onClickTime(time: Date) {
    const newDate = new Date();
    newDate.setMonth(date.getMonth());
    newDate.setDate(date.getDate());
    newDate.setHours(time.getHours());
    newDate.setMinutes(time.getMinutes());
    setSelectedDate(newDate);
    setIsDaySelect(true);
  }

  function onClickDate(date: Date) {
    setDate(date);
  }

  function onClickSubmit() {
    router.push({
      pathname: `/store/${slug}/menu/${number}`,
      query: {
        date: selectedDate.toISOString(),
      },
    });
  }

  return (
    <>
      <Header type={1} />

      <div className={styles.date}>
        <div className={styles.date_title}>날짜 선택</div>
        <Datepicker
          onClickDate={onClickDate}
          setIsDaySelect={setIsDaySelect}
          availableDays={availableDays}
        />
      </div>

      <div className={styles.time}>
        <div className={styles.time_title}>시간 선택</div>
        <div className={styles.time_content}>
          <Accordion flush defaultActiveKey="0">
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
                          key={amTime.time.toISOString()}
                          variant="outline-primary"
                          className={classNames(
                            styles.time_item,
                            styles.time_item_available
                          )}
                          onClick={() => onClickTime(amTime.time)}
                        >
                          {moment(amTime.time).format('HH:mm')}
                        </Button>
                      );
                    else {
                      return (
                        <Button
                          key={amTime.time.toISOString()}
                          variant="outline-secondary"
                          disabled={true}
                          className={classNames(
                            styles.time_item,
                            styles.time_item_unavailable
                          )}
                        >
                          {moment(amTime.time).format('HH:mm')}
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
                          key={pmTime.time.toISOString()}
                          variant="outline-primary"
                          className={classNames(
                            styles.time_item,
                            styles.time_item_available
                          )}
                          onClick={() => onClickTime(pmTime.time)}
                        >
                          {moment(pmTime.time).format('HH:mm')}
                        </Button>
                      );
                    else {
                      return (
                        <Button
                          key={pmTime.time.toISOString()}
                          variant="outline-secondary"
                          disabled={true}
                          className={classNames(
                            styles.time_item,
                            styles.time_item_unavailable
                          )}
                        >
                          {moment(pmTime.time).format('HH:mm')}
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
          {isDaySelect
            ? moment(selectedDate).format('MM월 D일 a h시 mm분')
            : '시간을 선택해주세요'}
        </div>
        <Button
          className={styles.result_submit}
          disabled={!isDaySelect}
          onClick={onClickSubmit}
        >
          선택
        </Button>
      </div>
    </>
  );
}

export default MenuTime;
