import classNames from 'classnames';
import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Button, Form, Tab, Tabs } from 'react-bootstrap';
import Header from '../../../components/header';
import Seperator from '../../../components/seperator';
import styles from '../../../styles/ProviderTime.module.scss';

interface ITime {
  [index: string]: { [index: string]: Date; start: Date; end: Date } | null;
  sunday: { [index: string]: Date; start: Date; end: Date } | null;
  monday: { [index: string]: Date; start: Date; end: Date } | null;
  thusday: { [index: string]: Date; start: Date; end: Date } | null;
  wednesday: { [index: string]: Date; start: Date; end: Date } | null;
  thursday: { [index: string]: Date; start: Date; end: Date } | null;
  friday: { [index: string]: Date; start: Date; end: Date } | null;
  saturday: { [index: string]: Date; start: Date; end: Date } | null;
}

export default function ProviderTime() {
  const [time, setTime] = useState<ITime>({
    sunday: null,
    monday: {
      start: new Date('1970-1-1 00:00'),
      end: new Date('1970-1-1 00:00'),
    },
    thusday: {
      start: new Date('1970-1-1 00:00'),
      end: new Date('1970-1-1 00:00'),
    },
    wednesday: {
      start: new Date('1970-1-1 00:00'),
      end: new Date('1970-1-1 00:00'),
    },
    thursday: {
      start: new Date('1970-1-1 00:00'),
      end: new Date('1970-1-1 00:00'),
    },
    friday: {
      start: new Date('1970-1-1 00:00'),
      end: new Date('1970-1-1 00:00'),
    },
    saturday: null,
  });

  function setDayOfWeek(
    dayOfWeek: string,
    startEnd: string,
    date: Date | null
  ) {
    let oneDay = time[dayOfWeek];
    // 시작 시간을 입력했을 때
    if (startEnd === 'start' && date !== null) {
      if (oneDay !== null) {
        oneDay['start'] = date;
      } else {
        oneDay = { start: date, end: new Date('1970-1-1 00:00') };
      }
    }
    // 종료 시간을 입력했을 때
    else if (startEnd === 'end' && date !== null) {
      if (oneDay !== null) {
        oneDay['end'] = date;
      } else {
        oneDay = { start: new Date('1970-1-1 00:00'), end: date };
      }
    }
    // 초기화를 했을 때
    else if (startEnd === 'on') {
      oneDay = {
        start: new Date('1970-1-1 00:00'),
        end: new Date('1970-1-1 00:00'),
      };
    }
    // 비활성화를 했을 때
    else if (startEnd === 'off') {
      oneDay = null;
    }
    setTime(Object.assign({}, time, { [dayOfWeek]: oneDay }));
  }

  useEffect(() => {
    console.log(time);
  }, [time]);

  return (
    <>
      <Header type={1} />
      <div className={styles.container}>
        <div className={styles.title}>매장 운영 시간 설정</div>
        <Tabs defaultActiveKey="time" className={styles.tabs} justify id="tabs">
          <Tab
            eventKey="time"
            title="요일별 영업 시간"
            tabClassName={styles.tab}
          >
            <TimeListItem dayOfWeek="sunday" setDayOfWeek={setDayOfWeek} />
            <Seperator />
            <TimeListItem dayOfWeek="monday" setDayOfWeek={setDayOfWeek} />
            <Seperator />
            <TimeListItem dayOfWeek="thusday" setDayOfWeek={setDayOfWeek} />
            <Seperator />
            <TimeListItem dayOfWeek="wednesday" setDayOfWeek={setDayOfWeek} />
            <Seperator />
            <TimeListItem dayOfWeek="thursday" setDayOfWeek={setDayOfWeek} />
            <Seperator />
            <TimeListItem dayOfWeek="friday" setDayOfWeek={setDayOfWeek} />
            <Seperator />
            <TimeListItem dayOfWeek="saturday" setDayOfWeek={setDayOfWeek} />
          </Tab>

          <Tab
            eventKey="except"
            title="예외 일자"
            tabClassName={styles.tab}
          ></Tab>
        </Tabs>
      </div>
    </>
  );
}

interface TimeListItemProps {
  dayOfWeek: string;
  setDayOfWeek: (
    dayOfWeek: string,
    startEnd: string,
    date: Date | null
  ) => void;
}

function TimeListItem({ dayOfWeek, setDayOfWeek }: TimeListItemProps) {
  /**
   * 기본적으로 일요일과 토요일은 해제시켜놓는다.
   */
  const [activate, setActivate] = useState(
    dayOfWeek === 'sunday' || dayOfWeek === 'saturday' ? false : true
  );

  function displayDayOfWeek() {
    switch (dayOfWeek) {
      case 'sunday':
        return '일';
      case 'monday':
        return '월';
      case 'thusday':
        return '화';
      case 'wednesday':
        return '수';
      case 'thursday':
        return '목';
      case 'friday':
        return '금';
      case 'saturday':
        return '토';
    }
  }

  useEffect(() => {
    if (activate) {
      setDayOfWeek(dayOfWeek, 'on', null);
    } else {
      setDayOfWeek(dayOfWeek, 'off', null);
    }
  }, [activate]);

  function onClick() {
    setActivate(!activate);
  }

  function onStartChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setDayOfWeek(dayOfWeek, 'start', new Date('1970-1-1 ' + e.target.value));
  }

  function onEndChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setDayOfWeek(dayOfWeek, 'end', new Date('1970-1-1 ' + e.target.value));
  }
  return (
    <div className={styles.item_container}>
      <button
        className={classNames(
          styles.day_of_week,
          activate ? styles.day_of_week_activate : styles.day_of_week_deactivate
        )}
        onClick={onClick}
      >
        {displayDayOfWeek()}
      </button>
      {activate ? (
        <TimeListItemSelect
          onStartChange={onStartChange}
          onEndChange={onEndChange}
        />
      ) : null}
    </div>
  );
}

interface TimeListItemSelectProps {
  onStartChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onEndChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

function TimeListItemSelect({
  onStartChange,
  onEndChange,
}: TimeListItemSelectProps) {
  function generateTime() {
    const arr = [];
    for (let h = 0; h <= 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hString = h.toString().padStart(2, '0');
        const mString = m.toString().padStart(2, '0');
        const s = `${hString}:${mString}`;
        arr.push(
          <option value={s} key={s}>
            {s}
          </option>
        );
      }
    }
    return arr;
  }

  return (
    <>
      <Form.Select className={styles.select} onChange={onStartChange}>
        {generateTime()}
      </Form.Select>
      ~
      <Form.Select className={styles.select} onChange={onEndChange}>
        {generateTime()}
      </Form.Select>
    </>
  );
}
