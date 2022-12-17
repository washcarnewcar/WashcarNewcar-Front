import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import styles from '../../styles/TimeList.module.scss';
import { TimeDto } from '../dto';
import { authClient } from '../function/request';
import Loading from './Loading';
import Seperator from './Seperator';

interface Time {
  start: string;
  end: string;
}

interface TimeListItemProps {
  time: Time | null;
  dayOfWeek: number;
}

const initialTimeList: (Time | null)[] = [
  null,
  {
    start: '10:00',
    end: '19:00',
  },
  {
    start: '10:00',
    end: '19:00',
  },
  {
    start: '10:00',
    end: '19:00',
  },
  {
    start: '10:00',
    end: '19:00',
  },
  {
    start: '10:00',
    end: '19:00',
  },
  null,
];

export default function TimeList() {
  // 0번부터 일요일 ~ 6번까지 토요일
  const [timeList, setTimeList] = useState<(Time | null)[]>(initialTimeList);
  const [error, setError] = useState<string[]>(['', '', '', '', '', '', '']);
  const [isSubmiting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const { slug } = router.query;

  const setDayOfWeek = (
    dayOfWeek: number,
    startEnd: string,
    time: string | null
  ) => {
    let oneDay = timeList[dayOfWeek];

    // 시작 시간을 입력했을 때
    if (startEnd === 'start' && time !== null && oneDay !== null) {
      oneDay.start = time;
    }
    // 종료 시간을 입력했을 때
    else if (startEnd === 'end' && time !== null && oneDay !== null) {
      oneDay.end = time;
    }
    // 초기화를 했을 때
    else if (startEnd === 'on') {
      oneDay = {
        start: '10:00',
        end: '19:00',
      };
      setErrors(dayOfWeek, false);
    }
    // 비활성화를 했을 때
    else if (startEnd === 'off') {
      oneDay = null;
      setErrors(dayOfWeek, false);
    }

    const newTimeList = [...timeList];
    newTimeList[dayOfWeek] = oneDay;
    setTimeList(newTimeList);
  };

  const setErrors = (dayOfWeek: number, isError: boolean) => {
    setError((error) => {
      error[dayOfWeek] = isError ? '운영 시간을 확인해주세요' : '';
      return error;
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    if (error.some((value) => value)) {
      alert('운영 시간을 다시 확인해주세요');
    }
    //
    else {
      const timeDto: TimeDto = {
        sunday: timeList[0],
        monday: timeList[1],
        tuesday: timeList[2],
        wednesday: timeList[3],
        thursday: timeList[4],
        friday: timeList[5],
        saturday: timeList[6],
      };

      try {
        const response = await authClient.post(
          `/provider/${slug}/time`,
          timeDto
        );
        console.debug(`POST /provider/${slug}/time`, timeDto);
        const data = response?.data;
        console.debug('time response data', data);
        switch (data?.status) {
          case 2000:
            alert('적용되었습니다.');
            return;
          case 2001:
            alert('운영 시간을 다시 확인해주세요');
            break;
          default:
            throw Error('잘못된 응답');
        }
      } catch (error) {
        console.error(error);
      }
    }
    setSubmitting(false);
  };

  useEffect(() => {
    const getData = async () => {
      const response = await authClient.get(`/provider/${slug}/time`);
      console.debug(`GET /provider/${slug}/time`);
      const data: TimeDto = response?.data;
      console.debug('time data', data);
      if (data) {
        const arr: (Time | null)[] = [null, null, null, null, null, null, null];
        arr[0] = data.sunday;
        arr[1] = data.monday;
        arr[2] = data.tuesday;
        arr[3] = data.wednesday;
        arr[4] = data.thursday;
        arr[5] = data.friday;
        arr[6] = data.saturday;
        setTimeList(arr);
        setReady(true);
      } else {
        setReady(true);
      }
    };

    if (slug) {
      getData();
    }
  }, [slug]);

  function TimeListItem({ time, dayOfWeek }: TimeListItemProps) {
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
        {time ? <TimeListItemSelect time={time} dayOfWeek={dayOfWeek} /> : null}
      </div>
    );
  }

  function TimeListItemSelect({ time, dayOfWeek }: TimeListItemProps) {
    const start = useRef<HTMLSelectElement>(null);
    const end = useRef<HTMLSelectElement>(null);

    const handleStartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (end.current && e.target.selectedIndex >= end.current.selectedIndex) {
        setErrors(dayOfWeek, true);
      } else {
        setErrors(dayOfWeek, false);
      }
      setDayOfWeek(dayOfWeek, 'start', e.target.value);
    };

    const handleEndChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (
        start.current &&
        e.target.selectedIndex <= start.current.selectedIndex
      ) {
        setErrors(dayOfWeek, true);
      } else {
        setErrors(dayOfWeek, false);
      }
      setDayOfWeek(dayOfWeek, 'end', e.target.value);
    };

    const generateTime = () => {
      const arr = [];
      for (let h = 0; h <= 23; h++) {
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
      <div>
        <div className={styles.select_group}>
          <Form.Select
            className={styles.select}
            value={time?.start}
            onChange={handleStartChange}
            isInvalid={!!error[dayOfWeek]}
            ref={start}
          >
            {generateTime()}
          </Form.Select>
          ~
          <Form.Select
            className={styles.select}
            value={time?.end}
            onChange={handleEndChange}
            isInvalid={!!error[dayOfWeek]}
            ref={end}
          >
            {generateTime()}
          </Form.Select>
        </div>
        <Form.Text className={styles.error_message}>
          {error[dayOfWeek]}
        </Form.Text>
      </div>
    );
  }

  if (!ready) {
    return (
      <div style={{ width: '100%', height: '20vh' }}>
        <Loading />
      </div>
    );
  }

  return (
    <>
      {timeList.map((time, index) => (
        <div key={index}>
          <TimeListItem time={time} dayOfWeek={index} />
          <Seperator />
        </div>
      ))}
      <div className={styles.button_container}>
        <Button
          className={styles.button}
          onClick={handleSubmit}
          disabled={error.some((error) => error) || isSubmiting}
        >
          {isSubmiting ? <BeatLoader color="white" size="10px" /> : '적용'}
        </Button>
      </div>
    </>
  );
}
