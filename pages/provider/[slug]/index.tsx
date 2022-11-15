import classNames from 'classnames';
import moment from 'moment';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Alert, Button, ButtonGroup, ListGroup } from 'react-bootstrap';
import { IoIosArrowForward } from 'react-icons/io';
import Header from '../../../src/components/Header';
import Loading from '../../../src/components/Loading';
import UserContext from '../../../src/contexts/UserProvider';
import { authClient } from '../../../src/functions/request';
import styles from '../../../styles/ProviderDashboard.module.scss';

interface Ready {
  status: boolean;
  request: boolean;
  schedule: boolean;
}

interface Request {
  reservationNumber: 1;
  menu: string;
  carNumbers: string;
  carModel: string;
  date: Date;
}

enum Status {
  Loading,
  Operation,
  Waiting,
  Abort,
}

export default function ProviderDashboard() {
  const router = useRouter();
  const { slug } = router.query;
  const { user, setUser } = useContext(UserContext);
  // 임시로 true
  const [storeStatus, setStoreStatus] = useState<Status>(Status.Loading);
  const [storeRequests, setStoreRequests] = useState<Request[]>([]);
  const [ready, setReady] = useState<Ready>({
    status: false,
    request: false,
    schedule: false,
  });

  const getStoreState = async () => {
    try {
      const response = await authClient.get(`/provider/${slug}/approve`);

      const data = response?.data;
      switch (data.status) {
        // 세차장 승인, 페이지 운영중
        case 1500:
          setStoreStatus(Status.Operation);
          setReady((ready) => ({
            ...ready,
            status: true,
          }));
          return;
        // 세차장 승인 대기중
        case 1501:
          setStoreStatus(Status.Waiting);
          setReady((ready) => ({
            ...ready,
            status: true,
          }));
          return;
        // 세차장 승인 거부
        case 1502:
          setStoreStatus(Status.Abort);
          setReady((ready) => ({
            ...ready,
            status: true,
          }));
          return;
        // 정상적인 접근 아님
        default:
          throw Error('정상적인 접근이 아닙니다.');
      }
    } catch (error) {
      console.error(error);
      // router.back();
    }
  };

  const getRequestList = async () => {
    try {
      const response = await authClient.get(`/provider/${slug}/request`);

      const list: Request[] = response?.data.list;
      console.log(list);
    } catch (error) {
      console.error(error);
      // router.back();
    }
  };

  const getScheduleList = async () => {
    const response = await authClient.get(`/provider/${slug}/schedule`);
    console.log(response);
  };

  useEffect(() => {
    getStoreState();
    getScheduleList();
  }, []);

  const renderStatus = () => {
    if (!ready.status) {
      return (
        <Alert className={styles.status}>
          <Loading />
        </Alert>
      );
    }

    switch (storeStatus) {
      case Status.Loading:
        return null;
      case Status.Operation:
        return (
          <Alert variant="success" className={styles.status}>
            세차장이 승인되었으며, 운영중입니다.
          </Alert>
        );
      case Status.Waiting:
        return (
          <Alert variant="primary" className={styles.status}>
            세차장 승인 대기중입니다.
          </Alert>
        );
      case Status.Abort:
        return (
          <Alert variant="danger" className={styles.status}>
            세차장 승인 대기중입니다.
          </Alert>
        );
    }
  };

  return (
    <>
      <Header type={1} />
      <div className={styles.container}>
        <div className={styles.status_container}>{renderStatus()}</div>

        <div className={styles.menus_container}>
          <div className={styles.title}>세차 예약 요청</div>
          <List />
        </div>

        <div className={styles.menus_container}>
          <div className={styles.title}>오늘의 세차 스케줄</div>
          <List />
        </div>

        <div className={styles.menus_container}>
          <div className={styles.title}>매장 관리</div>
          <div className={styles.buttongroup}>
            <Link href={`/provider/${slug}/store`}>
              <Button className={styles.button} variant="outline-primary">
                매장 정보 설정
              </Button>
            </Link>
            <Link href={`/provider/${slug}/menu`}>
              <Button className={styles.button} variant="outline-primary">
                메뉴 관리
              </Button>
            </Link>
            <Link href={`/provider/${slug}/time`}>
              <Button className={styles.button} variant="outline-primary">
                매장 운영 시간 설정
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function List() {
  return (
    <ListGroup className={classNames(styles.list, styles.reqest)}>
      <ListGroup.Item>
        <Link href="/provider/hello/reservation/1">
          <a className={styles.link}>
            <div className={styles.content_container}>
              <div>
                <div className={styles.menu}>외부 세차</div>
                <div className={styles.car}>기아 EV6 / 31하 1450</div>
                <div className={styles.date}>
                  {moment().format('YYYY.MM.DD(dd) HH:mm')}
                </div>
              </div>
              <div className={styles.arrow}>
                <IoIosArrowForward size={25} />
              </div>
            </div>
          </a>
        </Link>
      </ListGroup.Item>
      <ListGroup.Item>
        <Link href="/">
          <a className={styles.link}>
            <div className={styles.content_container}>
              <div>
                <div className={styles.menu}>외부 세차</div>
                <div className={styles.car}>기아 EV6 / 31하 1450</div>
                <div className={styles.date}>
                  {moment().format('YYYY.MM.DD(dd) HH:mm')}
                </div>
              </div>
              <div className={styles.arrow}>
                <IoIosArrowForward size={25} />
              </div>
            </div>
          </a>
        </Link>
      </ListGroup.Item>
      <ListGroup.Item>
        <Link href="/">
          <a className={styles.link}>
            <div className={styles.content_container}>
              <div>
                <div className={styles.menu}>외부 세차</div>
                <div className={styles.car}>기아 EV6 / 31하 1450</div>
                <div className={styles.date}>
                  {moment().format('YYYY.MM.DD(dd) HH:mm')}
                </div>
              </div>
              <div className={styles.arrow}>
                <IoIosArrowForward size={25} />
              </div>
            </div>
          </a>
        </Link>
      </ListGroup.Item>
    </ListGroup>
  );
}
