import classNames from 'classnames';
import moment, { min } from 'moment';
import React, {
  InputHTMLAttributes,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  Button,
  Form,
  ListGroup,
  ListGroupItem,
  Tab,
  Tabs,
} from 'react-bootstrap';
import { Calendar } from 'react-calendar';
import { IoAdd, IoTrash } from 'react-icons/io5';
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
          {/* 요일별 영업시간 렌더링 */}
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
          {/* 예외 일자 렌더링 */}
          <Tab eventKey="except" title="예외 일자" tabClassName={styles.tab}>
            <Except />
          </Tab>
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

  const onClick = useCallback(() => {
    const newList = [...exceptList];
    newList.push({ allDay: true, start: '', end: '' });
    setExceptList(newList);
  }, [exceptList]);

  const deleteItem = useCallback(
    (index: number) => {
      const newList = [...exceptList];
      newList.splice(index, 1);
      setExceptList(newList);
    },
    [exceptList]
  );

  const setData = useCallback(
    (index: number, allday: boolean, start: string, end: string) => {
      const newList = [...exceptList];
      newList[index].allDay = allday;
      newList[index].start = start;
      newList[index].end = end;
      console.log(newList);

      setExceptList(newList);
    },
    [exceptList]
  );

  return (
    <div className={styles.except_wrapper}>
      <Button className={styles.except_plus_button} onClick={onClick}>
        <IoAdd size={20} className={styles.except_plus_icon} />
        예외 일자 추가
      </Button>

      <ListGroup>
        {exceptList.map((except, index) => {
          return (
            <ListGroupItem key={index}>
              <ExceptItem
                exceptList={exceptList}
                index={index}
                deleteItem={deleteItem}
                setData={setData}
              />
            </ListGroupItem>
          );
        })}
      </ListGroup>
    </div>
  );
}

interface ExceptItemProps {
  exceptList: ExceptData[];
  index: number;
  deleteItem: Function;
  setData: Function;
}
/**
 * 예외일자 아이템 하나의 컴포넌트
 */
function ExceptItem({
  exceptList,
  index,
  deleteItem,
  setData,
}: ExceptItemProps) {
  const [allDay, setAllDay] = useState(exceptList[index].allDay);
  const [start, setStart] = useState(exceptList[index].start);
  const [end, setEnd] = useState(exceptList[index].end);

  const onAllDayChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAllDay(!allDay);
      setStart('');
      setEnd('');
    },
    [allDay]
  );

  const onStartChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setStart(e.target.value);
    },
    []
  );

  const onTrashClick = useCallback(() => {
    deleteItem(index);
  }, [deleteItem]);

  const onEndChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEnd(e.target.value);
  }, []);

  const renderAllDay = useCallback(() => {
    return (
      <div className={styles.form_wrapper}>
        <Form.Control type="date" value={start} onChange={onStartChange} />
        ~
        <Form.Control type="date" value={end} onChange={onEndChange} />
        <div className={styles.trash_wrapper}>
          <button className={styles.trash} onClick={onTrashClick}>
            <IoTrash size={20} />
          </button>
        </div>
      </div>
    );
  }, [start, end, deleteItem]);

  const renderPartDay = useCallback(() => {
    return (
      <div className={styles.form_wrapper}>
        <Form.Control
          type="datetime-local"
          value={start}
          onChange={onStartChange}
        />
        ~
        <Form.Control
          type="datetime-local"
          value={end}
          onChange={onEndChange}
        />
        <div className={styles.trash_wrapper}>
          <button className={styles.trash} onClick={onTrashClick}>
            <IoTrash size={20} />
          </button>
        </div>
      </div>
    );
  }, [start, end, deleteItem]);

  useEffect(() => {
    setData(index, allDay, start, end);
  }, [start, end, allDay]);

  useEffect(() => {
    setAllDay(exceptList[index].allDay);
    setStart(exceptList[index].start);
    setEnd(exceptList[index].end);
  }, [exceptList]);

  return (
    <div className={styles.except_item_container}>
      <Form.Check
        type="switch"
        label="하루종일"
        onChange={onAllDayChange}
        checked={allDay}
      />
      {allDay ? renderAllDay() : renderPartDay()}
    </div>
  );
}
