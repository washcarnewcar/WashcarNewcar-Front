import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Button, Form, ListGroup, ListGroupItem } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import { TimeDto } from '../dto';
import { authClient } from '../function/request';
import Loading from './Loading';

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
  const [ready, setReady] = useState(true);
  const router = useRouter();
  const { slug } = router.query;

  const setDayOfWeek = (dayOfWeek: number, startEnd: string, time: string | null) => {
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

      const response = await authClient.post(`/provider/${slug}/time`, timeDto);
      console.debug(`POST /provider/${slug}/time`, timeDto);
      const status = response?.data?.status;
      const message = response?.data?.message;
      if (status && message) {
        switch (status) {
          case 2000:
            alert('적용되었습니다.');
            return;
          case 2001:
            alert('운영 시간을 다시 확인해주세요');
            break;
          default:
            throw new Error(message);
        }
      } else {
        throw new Error('잘못된 응답');
      }
    }
    setSubmitting(false);
  };

  useEffect(() => {
    if (!router.isReady) return;

    const getData = async () => {
      const response = await authClient.get(`/provider/${slug}/time`);
      console.debug(`GET /provider/${slug}/time`, response?.data);
      const data: TimeDto = response?.data;
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
  }, [router.isReady]);

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
      <ListGroupItem className="d-flex align-items-center gap-3">
        <button
          className={classNames(
            'd-flex justify-content-center align-items-center fw-bold rounded tw-w-[40px] tw-h-[40px]',
            time ? 'btn btn-primary' : 'hover:tw-bg-gray-100 tw-bg-white tw-border border-primary text-primary'
          )}
          onClick={handleClick}
        >
          {displayDayOfWeek()}
        </button>
        {time ? <TimeListItemSelect time={time} dayOfWeek={dayOfWeek} /> : null}
      </ListGroupItem>
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
      if (start.current && e.target.selectedIndex <= start.current.selectedIndex) {
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
        <div className="d-flex align-items-center gap-2">
          <Form.Select
            className="tw-text-xs"
            value={time?.start}
            onChange={handleStartChange}
            isInvalid={!!error[dayOfWeek]}
            ref={start}
          >
            {generateTime()}
          </Form.Select>
          ~
          <Form.Select
            className="tw-text-sm"
            value={time?.end}
            onChange={handleEndChange}
            isInvalid={!!error[dayOfWeek]}
            ref={end}
          >
            {generateTime()}
          </Form.Select>
        </div>
        <Form.Text className="text-danger">{error[dayOfWeek]}</Form.Text>
      </div>
    );
  }

  if (!ready) {
    return <Loading fullscreen />;
  }

  return (
    <>
      <ListGroup variant="flush">
        {timeList.map((time, index) => (
          <TimeListItem key={index} time={time} dayOfWeek={index} />
        ))}
      </ListGroup>
      <div className="mt-3 w-100 text-center">
        <Button className="tw-w-[120px]" onClick={handleSubmit} disabled={error.some((error) => error) || isSubmiting}>
          {isSubmiting ? <BeatLoader color="white" size="10px" /> : '저장'}
        </Button>
      </div>
    </>
  );
}
