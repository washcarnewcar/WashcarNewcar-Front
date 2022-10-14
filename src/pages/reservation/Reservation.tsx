import classNames from 'classnames';
import moment from 'moment';
import { Button, ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import styles from './Reservation.module.scss';

interface State {
  title: string;
  detail: string;
}

const requestData: State = {
  title: '예약을 확인중입니다.',
  detail: `세차장에서 예약을 확인중입니다.
  예약이 완료되면 카카오톡을 통해 알려드릴게요!`,
};
const reservationData: State = {
  title: '예약이 완료되었습니다.',
  detail: `세차장에서 예약을 확인했습니다.
  예약 시간을 지켜주세요!`,
};
const rejectData: State = {
  title: '예약이 거부되었습니다.',
  detail: ``,
};
const cancelData: State = {
  title: '예약이 취소되었습니다.',
  detail: ``,
};
const complete: State = {
  title: '세차가 완료되었습니다.',
  detail: ``,
};

export default function Reservation() {
  const { id } = useParams();

  return (
    <>
      <Header type={1} />
      <div className={styles.container}>
        <div className={styles.state_container}>
          <div className={styles.state}>{'예약을 확인중입니다.'}</div>
          <div className={styles.state_detail}>
            세차장에서 예약을 확인중입니다.
            <br />
            예약이 완료되면 카카오톡을 통해 알려드릴게요!
          </div>
        </div>
        <div className={styles.info_container}>
          <ListGroup>
            <ListGroup.Item className={classNames(styles.list, styles.title)}>
              예약정보
            </ListGroup.Item>
            <ListGroup.Item className={classNames(styles.list, styles.detail)}>
              <table>
                <tr>
                  <td className={styles.head}>차량</td>
                  <td className={styles.content}>
                    기아 EV6
                    <br />
                    31하 1450
                  </td>
                </tr>
                <tr>
                  <td className={styles.head}>세차장</td>
                  <td
                    className={styles.content}
                  >{`루페스 디테일링 센터 인천논현점`}</td>
                </tr>
                <tr>
                  <td className={styles.head}>세차종류</td>
                  <td className={styles.content}>{`외부 세차`}</td>
                </tr>
                <tr>
                  <td className={styles.head}>일정</td>
                  <td className={styles.content}>
                    {moment().format('YYYY.MM.DD(dd) a HH:mm')}
                  </td>
                </tr>
                <tr>
                  <td className={styles.head}>예상시간</td>
                  <td className={styles.content}>
                    {moment().format('H시간 mm분')}
                  </td>
                </tr>
                <tr>
                  <td className={styles.head}>거부 사유</td>
                  <td className={styles.content}>
                    저희 세차장에서는 해당 차를 세차할 수 있는 공간이 없습니다.
                  </td>
                </tr>
                <tr>
                  <td className={styles.head}>취소 사유</td>
                  <td className={styles.content}>잘못 예약했습니다.</td>
                </tr>
                <tr>
                  <td className={styles.head}>완료 시간</td>
                  <td className={styles.content}>
                    {moment().format('YYYY.MM.DD(dd) a HH:mm')}
                  </td>
                </tr>
              </table>
            </ListGroup.Item>
          </ListGroup>
        </div>
        <div className={styles.button_container}>
          <Button variant="outline-danger" className={styles.button}>
            예약취소
          </Button>
          <Button className={styles.button}>홈으로 돌아가기</Button>
        </div>
      </div>
    </>
  );
}
