import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Button, Form, InputGroup, ListGroup, ListGroupItem } from 'react-bootstrap';
import { IoAdd, IoTrash } from 'react-icons/io5';
import { BeatLoader } from 'react-spinners';
import styles from '../../styles/Except.module.scss';
import { ExceptDto } from '../dto';
import { authClient } from '../function/request';
import Loading from './Loading';

/**
 * 예외일자 컴포넌트
 */
export default function Except() {
  const [exceptList, setExceptList] = useState<ExceptDto[]>([]);
  const [isSubmitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const { slug } = router.query;

  const handleAddClick = () => {
    const newList = [...exceptList];
    newList.push({
      allday: true,
      start: moment().format('YYYY-MM-DD'),
      end: moment().add(1, 'day').format('YYYY-MM-DD'),
      error: '',
    });
    setExceptList(newList);
  };

  const deleteItem = (index: number) => {
    const newList = [...exceptList];
    newList.splice(index, 1);
    setExceptList(newList);
  };

  const setData = (index: number, allday: boolean, start: string, end: string) => {
    let error = '';
    // 입력했는지 확인
    if (!start || !end) {
      error = '날짜를 입력해주세요';
    }
    // 시작 시간이 끝 시간을 넘지 않았는지 확인
    else {
      const startMoment = moment(start).toJSON();
      const endMoment = moment(end).toJSON();

      if (allday) {
        if (startMoment > endMoment) {
          error = '예외시간을 확인해주세요';
        }
      } else {
        if (startMoment >= endMoment) {
          error = '예외시간을 확인해주세요';
        }
      }
    }

    const newList = [...exceptList];
    newList[index].allday = allday;
    newList[index].start = start;
    newList[index].end = end;
    newList[index].error = error;
    setExceptList(newList);
  };

  const handleSubmit = async () => {
    // 오류가 하나라도 있을 경우
    if (exceptList.some((except) => except.error)) {
      alert('예외시간을 확인해주세요');
      return;
    }

    setSubmitting(true);

    const mappedExceptList: (ExceptDto | undefined)[] = exceptList.map((except) => {
      // 하루종일인 경우 2022-11-11 => 2122-11-11 00:00
      if (except.allday) {
        return {
          start: moment(except.start).format('YYYY-MM-DD HH:mm'),
          end: moment(except.end).format('YYYY-MM-DD HH:mm'),
          allday: except.allday,
          error: except.error,
        };
      } else {
        return { ...except };
      }
    });

    const sendData = { except: mappedExceptList };

    console.debug(`POST /provider/${slug}/except`, sendData);
    const response = await authClient.post(`/provider/${slug}/except`, sendData);
    const status = response?.data?.status;
    const message = response?.data?.message;
    if (status && message) {
      switch (status) {
        case 2100:
          alert('저장되었습니다.');
          break;
        case 2101:
          alert('저장중에 오류가 발생했습니다.');
          break;
        default:
          throw new Error(message);
      }
    } else {
      throw new Error('잘못된 응답');
    }
    setSubmitting(false);
  };

  useEffect(() => {
    if (!router.isReady) return;

    const getData = async () => {
      const response = await authClient.get(`/provider/${slug}/except`);
      const excepts: ExceptDto[] = response?.data?.except;
      console.debug(`GET /provider/${slug}/except`, excepts);
      if (excepts) {
        const mappedData = excepts.map((except) => {
          // 하루종일인 경우 2022-11-11 00:00 => 2122-11-11
          if (except.allday) {
            return {
              start: moment(except.start).format('YYYY-MM-DD'),
              end: moment(except.end).format('YYYY-MM-DD'),
              allday: except.allday,
              error: except.error,
            };
          } else {
            return { ...except };
          }
        });
        console.debug('mapped data', mappedData);
        setExceptList(mappedData);
        setReady(true);
      } else {
        setReady(true);
      }
    };

    if (slug) {
      getData();
    }
  }, [router.isReady]);

  return (
    <div className={styles.except_wrapper}>
      <div className={styles.button_wrapper}>
        <Button className={styles.button} onClick={handleAddClick} variant="outline-primary">
          <IoAdd size={20} className={styles.except_plus_icon} />
          예외 일자 추가
        </Button>
        <Button
          className={styles.button}
          onClick={handleSubmit}
          disabled={exceptList.some((except) => except.error) || isSubmitting}
        >
          {isSubmitting ? <BeatLoader color="white" size={10} /> : '저장'}
        </Button>
      </div>

      <ListGroup>
        {/* 로딩중인 경우 Loading 컴포넌트 표시 */}
        {!ready ? (
          <ListGroupItem>
            <Loading />
          </ListGroupItem>
        ) : (
          exceptList.map((except, index) => (
            <ListGroupItem key={index}>
              <ExceptItem except={except} index={index} deleteItem={deleteItem} setData={setData} />
            </ListGroupItem>
          ))
        )}
      </ListGroup>
    </div>
  );
}

interface ExceptItemProps {
  except: ExceptDto;
  index: number;
  deleteItem: (index: number) => void;
  setData: (index: number, allday: boolean, start: string, end: string) => void;
}
/**
 * 예외일자 아이템 하나의 컴포넌트
 */
function ExceptItem({ except, index, deleteItem, setData }: ExceptItemProps) {
  const start = useRef<HTMLInputElement>(null);
  const end = useRef<HTMLInputElement>(null);

  const handleAllDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (except.allday) {
      setData(
        index,
        !except.allday,
        except.start ? moment(except.start).format('YYYY-MM-DD HH:mm') : '',
        except.end ? moment(except.end).format('YYYY-MM-DD HH:mm') : ''
      );
    } else {
      setData(
        index,
        !except.allday,
        except.start ? moment(except.start).format('YYYY-MM-DD') : '',
        except.end ? moment(except.end).format('YYYY-MM-DD') : ''
      );
    }
  };

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(index, except.allday, e.target.value, except.end);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(index, except.allday, except.start, e.target.value);
  };

  const handleTrashClick = () => {
    deleteItem(index);
  };

  const renderAllDay = () => (
    <div className={styles.date_wrapper}>
      <InputGroup className={styles.input_group}>
        <InputGroup.Text>시작</InputGroup.Text>
        <Form.Control
          type="date"
          value={except.start}
          onChange={handleStartChange}
          ref={start}
          isInvalid={!!except.error}
        />
      </InputGroup>
      <InputGroup>
        <InputGroup.Text>종료</InputGroup.Text>
        <Form.Control type="date" value={except.end} onChange={handleEndChange} ref={end} isInvalid={!!except.error} />
      </InputGroup>
    </div>
  );

  const renderPartDay = () => (
    <div className={styles.date_wrapper}>
      <InputGroup className={styles.input_group}>
        <InputGroup.Text>시작</InputGroup.Text>
        <Form.Control
          type="datetime-local"
          value={except.start}
          onChange={handleStartChange}
          ref={start}
          isInvalid={!!except.error || !except.start}
        />
      </InputGroup>
      <InputGroup>
        <InputGroup.Text>종료</InputGroup.Text>
        <Form.Control
          type="datetime-local"
          value={except.end}
          onChange={handleEndChange}
          ref={end}
          isInvalid={!!except.error || !except.end}
        />
      </InputGroup>
    </div>
  );

  return (
    <div className={styles.except_item_container}>
      <div className={styles.switch_trash_wrapper}>
        <Form.Check
          type="switch"
          label="하루종일"
          onChange={handleAllDayChange}
          checked={except.allday}
          className={styles.switch}
        />
        <button className={styles.trash} onClick={handleTrashClick}>
          <IoTrash size={20} />
        </button>
      </div>
      <div className={styles.form_wrapper}>
        {except.allday ? renderAllDay() : renderPartDay()}
        {except.error ? (
          <Form.Control.Feedback type="invalid" style={{ display: 'inline' }}>
            {except.error}
          </Form.Control.Feedback>
        ) : null}
      </div>
    </div>
  );
}
