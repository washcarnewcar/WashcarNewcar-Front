import classNames from 'classnames';
import moment from 'moment';
import { useCallback, useMemo, useState } from 'react';
import styles from './Datepicker.module.scss';

interface DatePickerProps {
  onClickDate: Function;
  setIsDaySelect: React.Dispatch<boolean>;
  availableDays: string[];
}

const Datepicker = ({
  onClickDate,
  setIsDaySelect,
  availableDays,
}: DatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const today = useMemo(() => new Date(), []);

  const isDateAvailable = useCallback(
    (date: Date) => {
      if (availableDays.includes(moment(date).format('YYYY-MM-DD')))
        return true;
      else return false;
    },
    [availableDays]
  );

  const onClick = useCallback((date: Date) => {
    setSelectedDate(date);
    setIsDaySelect(false);
    onClickDate(date);
  }, []);

  const generateDays = useCallback(() => {
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
          available={isDateAvailable(date)}
        />
      );
    }

    return days;
  }, [selectedDate, isDateAvailable, onClick, today]);

  return <div className={styles.calendar_container}>{generateDays()}</div>;
};

interface DayProps {
  date: Date;
  selected: boolean;
  available: boolean;
  onClick: Function;
}

const Day = ({
  date,
  selected = false,
  onClick,
  available = false,
}: DayProps) => {
  const week = ['일', '월', '화', '수', '목', '금', '토']; // 일주일

  const selectClass = useCallback(() => {
    const arr = [styles.date];
    if (available) {
      if (selected) {
        arr.push(styles.date_selected);
      } else {
        arr.push(styles.date_unselected);
      }
    } else {
      arr.push(styles.date_unavailable);
    }
    return classNames(arr);
  }, [available, selected]);

  return (
    <div className={styles.date_container}>
      <div className={styles.day}>
        {moment(date).format('YYYY-MM-DD') ===
        moment(new Date()).format('YYYY-MM-DD')
          ? '오늘'
          : week[date.getDay()]}
      </div>
      {/* 가능할 때는 선택가능, 색깔 표시 / 불가능할때는 선택 불가능, 회색 표시 */}
      <div
        className={selectClass()}
        onClick={available ? () => onClick(date) : undefined}
      >
        {date.getDate()}
      </div>
    </div>
  );
};

export default Datepicker;
