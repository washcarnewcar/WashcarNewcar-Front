import { useState } from 'react';
import { MAIN_COLOR } from '../global_variables';
import styles from './Datepicker.module.scss';

const Datepicker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const today = new Date();

  const generateDays = () => {
    const days = [];

    // 2주
    for (let i = 0; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(
        <Day
          key={i}
          date={date}
          selected={date.getDate() === selectedDate.getDate() ? true : false}
          onClick={onClick}
        />
      );
    }

    return days;
  };

  const onClick = (date: Date) => setSelectedDate(date);

  return <div className={styles.calendar_container}>{generateDays()}</div>;
};

interface DayProps {
  date: Date;
  selected?: boolean;
  onClick: Function;
}

const Day = ({ date, selected = false, onClick }: DayProps) => {
  const week = ['일', '월', '화', '수', '목', '금', '토']; // 일주일
  return (
    <div className={styles.date_container}>
      <div className={styles.day}>
        {date.getDate() === new Date().getDate() ? '오늘' : week[date.getDay()]}
      </div>
      <div
        className={styles.date}
        style={{
          color: selected ? 'white' : 'black',
          backgroundColor: selected ? MAIN_COLOR : 'white',
        }}
        onClick={() => onClick(date)}
      >
        {date.getDate()}
      </div>
    </div>
  );
};

export default Datepicker;
