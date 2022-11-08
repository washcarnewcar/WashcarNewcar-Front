import classNames from 'classnames';
import React, { useState } from 'react';
import {
  Button,
  Form,
  ListGroup,
  ListGroupItem,
  Tab,
  Tabs,
} from 'react-bootstrap';
import { IoAdd, IoTrash } from 'react-icons/io5';
import Header from '../../../components/Header';
import Seperator from '../../../components/Seperator';
import styles from '../../../styles/ProviderTime.module.scss';

interface Time {
  start: Date;
  end: Date;
}

export default function ProviderTime() {
  return (
    <>
      <Header type={1} />
      <div className={styles.container}>
        <div className={styles.title}>매장 운영 시간 설정</div>
        <Tabs defaultActiveKey="time" className={styles.tabs} justify id="tabs">
          {/* 요일별 영업시간 렌더링 */}
          <Tab
            eventKey="time"
            title="요일별 영업 시간"
            tabClassName={styles.tab}
          >
            <TimeList />
          </Tab>
          {/* 예외 일자 렌더링 */}
          <Tab eventKey="except" title="예외 일자" tabClassName={styles.tab}>
            <Except />
          </Tab>
        </Tabs>
      </div>
    </>
  );
}

function TimeList() {
  // 0번부터 일요일 ~ 6번까지 토요일
  const [timeList, setTimeList] = useState<(Time | null)[]>([
    null,
    {
      start: new Date('1970-1-1 00:00'),
      end: new Date('1970-1-1 00:00'),
    },
    {
      start: new Date('1970-1-1 00:00'),
      end: new Date('1970-1-1 00:00'),
    },
    {
      start: new Date('1970-1-1 00:00'),
      end: new Date('1970-1-1 00:00'),
    },
    {
      start: new Date('1970-1-1 00:00'),
      end: new Date('1970-1-1 00:00'),
    },
    {
      start: new Date('1970-1-1 00:00'),
      end: new Date('1970-1-1 00:00'),
    },
    null,
  ]);

  const setDayOfWeek = (
    dayOfWeek: number,
    startEnd: string,
    date: Date | null
  ) => {
    let oneDay = timeList[dayOfWeek];

    // 시작 시간을 입력했을 때
    if (startEnd === 'start' && date !== null && oneDay !== null) {
      oneDay.start = date;
    }
    // 종료 시간을 입력했을 때
    else if (startEnd === 'end' && date !== null && oneDay !== null) {
      oneDay.end = date;
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

    const newTimeList = [...timeList];
    newTimeList[dayOfWeek] = oneDay;
    setTimeList(newTimeList);
  };

  return (
    <>
      {timeList.map((time, index) => (
        <div key={index}>
          <TimeListItem
            time={time}
            dayOfWeek={index}
            setDayOfWeek={setDayOfWeek}
          />
          <Seperator />
        </div>
      ))}
    </>
  );
}

interface TimeListItemProps {
  time: Time | null;
  dayOfWeek: number;
  setDayOfWeek: (
    dayOfWeek: number,
    startEnd: string,
    date: Date | null
  ) => void;
}

function TimeListItem({ time, dayOfWeek, setDayOfWeek }: TimeListItemProps) {
  const displayDayOfWeek = () => {
    const name = ['일', '월', '화', '수', '목', '금', '토'];
    return name[dayOfWeek];
  };

  const handleClick = () => {
    if (time) {
      setDayOfWeek(dayOfWeek, 'off', null);
    } else {
      setDayOfWeek(dayOfWeek, 'on', null);
    }
  };

  const handleStartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDayOfWeek(dayOfWeek, 'start', new Date('1970-1-1 ' + e.target.value));
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDayOfWeek(dayOfWeek, 'end', new Date('1970-1-1 ' + e.target.value));
  };

  return (
    <div className={styles.item_container}>
      <button
        className={classNames(
          styles.day_of_week,
          time ? styles.day_of_week_activate : styles.day_of_week_deactivate
        )}
        onClick={handleClick}
      >
        {displayDayOfWeek()}
      </button>
      {time ? (
        <TimeListItemSelect
          onStartChange={handleStartChange}
          onEndChange={handleEndChange}
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
  const generateTime = () => {
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
  };

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

interface ExceptData {
  allDay: boolean;
  start: string;
  end: string;
}

/**
 * 예외일자 컴포넌트
 */
function Except() {
  const [exceptList, setExceptList] = useState<ExceptData[]>([]);

  const handleClick = () => {
    const newList = [...exceptList];
    newList.push({ allDay: true, start: '', end: '' });
    setExceptList(newList);
  };

  const deleteItem = (index: number) => {
    const newList = [...exceptList];
    newList.splice(index, 1);
    setExceptList(newList);
  };

  const setData = (
    index: number,
    allday: boolean,
    start: string,
    end: string
  ) => {
    const newList = [...exceptList];
    newList[index].allDay = allday;
    newList[index].start = start;
    newList[index].end = end;
    setExceptList(newList);
  };

  return (
    <div className={styles.except_wrapper}>
      <Button className={styles.except_plus_button} onClick={handleClick}>
        <IoAdd size={20} className={styles.except_plus_icon} />
        예외 일자 추가
      </Button>

      <ListGroup>
        {exceptList.map((except, index) => (
          <ListGroupItem key={index}>
            <ExceptItem
              except={except}
              index={index}
              deleteItem={deleteItem}
              setData={setData}
            />
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
}

interface ExceptItemProps {
  except: ExceptData;
  index: number;
  deleteItem: (index: number) => void;
  setData: (index: number, allday: boolean, start: string, end: string) => void;
}
/**
 * 예외일자 아이템 하나의 컴포넌트
 */
function ExceptItem({ except, index, deleteItem, setData }: ExceptItemProps) {
  const handleAllDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(index, !except.allDay, except.start, except.end);
  };

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(index, except.allDay, e.target.value, except.end);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(index, except.allDay, except.start, e.target.value);
  };

  const handleTrashClick = () => {
    deleteItem(index);
  };

  const renderAllDay = () => (
    <div className={styles.allday_form_wrapper}>
      <Form.Control
        type="date"
        value={except.start}
        onChange={handleStartChange}
      />
      ~
      <Form.Control type="date" value={except.end} onChange={handleEndChange} />
      <div className={styles.allday_trash_wrapper}>
        <button className={styles.allday_trash} onClick={handleTrashClick}>
          <IoTrash size={20} />
        </button>
      </div>
    </div>
  );

  const renderPartDay = () => (
    <div className={styles.partday_form_container}>
      <div className={styles.partday_form_wrapper}>
        <Form.Control
          type="datetime-local"
          value={except.start}
          onChange={handleStartChange}
        />
        ~
        <Form.Control
          type="datetime-local"
          value={except.end}
          onChange={handleEndChange}
        />
      </div>
      <div className={styles.partday_trash_wrapper}>
        <button className={styles.partday_trash} onClick={handleTrashClick}>
          <IoTrash size={20} />
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.except_item_container}>
      <Form.Check
        type="switch"
        label="하루종일"
        onChange={handleAllDayChange}
        checked={except.allDay}
      />
      {except.allDay ? renderAllDay() : renderPartDay()}
    </div>
  );
}
