import classNames from 'classnames';
import moment from 'moment';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Alert, Button, ListGroup } from 'react-bootstrap';
import { IoIosArrowForward } from 'react-icons/io';
import Loading from '../../../src/components/Loading';
import LoginCheck from '../../../src/components/LoginCheck';
import UserContext from '../../../src/context/UserProvider';
import { RequestDto, ScheduleDto } from '../../../src/dto';
import { authClient } from '../../../src/function/request';
import styles from '../../../styles/ProviderDashboard.module.scss';

interface Ready {
  status: boolean;
  request: boolean;
  schedule: boolean;
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
  const [storeRequests, setStoreRequests] = useState<RequestDto[]>([]);
  const [ready, setReady] = useState<Ready>({
    status: false,
    request: false,
    schedule: false,
  });

  useEffect(() => {
    if (!router.isReady) return;

    const getStoreState = async () => {
      const response = await authClient.get(`/provider/${slug}/approve`);
      const data = response?.data;
      console.debug(`GET /provider/${slug}/approve`, data);
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
          throw Error('잘못된 응답');
      }
    };

    const getRequestList = async () => {
      const response = await authClient.get(`/provider/${slug}/request`);
      const list: RequestDto[] = response.data.list;
      console.debug(`GET /provider/${slug}/request`, list);
    };

    const getScheduleList = async () => {
      const response = await authClient.get(`/provider/${slug}/schedule`);
      const list: ScheduleDto[] = response.data.list;
      console.debug(`GET /provider/${slug}/schedule`, list);
    };

    if (slug) {
      getStoreState();
      getRequestList();
      getScheduleList();
    } else {
      router.replace('/');
    }
  }, [router.isReady]);

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
      <Head>
        <title>세차새차 - 대시보드</title>
      </Head>
      <LoginCheck>
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
              <Button
                className={styles.button}
                variant="outline-primary"
                onClick={() => {
                  router.push(`/provider/${slug}/store`);
                }}
              >
                매장 정보 설정
              </Button>
              <Button
                className={styles.button}
                variant="outline-primary"
                onClick={() => {
                  router.push(`/provider/${slug}/menu`);
                }}
              >
                메뉴 관리
              </Button>
              <Button
                className={styles.button}
                variant="outline-primary"
                onClick={() => {
                  router.push(`/provider/${slug}/time`);
                }}
              >
                매장 운영 시간 설정
              </Button>
            </div>
          </div>
        </div>
      </LoginCheck>
    </>
  );
}

function List() {
  return (
    <ListGroup className={classNames(styles.list, styles.reqest)}>
      <ListGroup.Item>
        <Link href="/provider/hello/reservation/1" className={styles.link}>
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
        </Link>
      </ListGroup.Item>
      <ListGroup.Item>
        <Link href="/" className={styles.link}>
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
        </Link>
      </ListGroup.Item>
      <ListGroup.Item>
        <Link href="/" className={styles.link}>
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
        </Link>
      </ListGroup.Item>
    </ListGroup>
  );
}
