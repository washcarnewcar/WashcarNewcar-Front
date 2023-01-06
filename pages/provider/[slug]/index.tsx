import moment from 'moment';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { IoIosArrowForward } from 'react-icons/io';
import Loading from '../../../src/components/Loading';
import LoginCheck from '../../../src/components/LoginCheck';
import { RequestDto, ScheduleDto } from '../../../src/dto';
import { authClient } from '../../../src/function/request';

interface Ready {
  request: boolean;
  schedule: boolean;
}

enum Status {
  Loading,
  Operation,
  Waiting,
  Abort,
}

interface StoreStatus {
  status: Status;
  message: string;
  reason?: string;
}

export default function ProviderDashboard() {
  const router = useRouter();
  const { slug } = router.query;
  // 임시로 true
  const [storeStatus, setStoreStatus] = useState<StoreStatus>({ status: Status.Loading, message: '' });
  const [storeRequests, setStoreRequests] = useState<RequestDto[]>([]);
  const [ready, setReady] = useState<Ready>({
    request: false,
    schedule: false,
  });

  useEffect(() => {
    if (!router.isReady) return;

    const getStoreState = async () => {
      const response = await authClient.get(`/provider/${slug}/approve`);
      const status = response?.data?.status;
      const message = response?.data?.message;
      const reason = response?.data?.reason;
      console.debug(`GET /provider/${slug}/approve`, response?.data);
      if (status && message) {
        switch (status) {
          // 세차장 승인, 페이지 운영중
          case 1500:
            setStoreStatus({ status: Status.Operation, message: message });
            return;
          // 세차장 승인 대기중
          case 1501:
            setStoreStatus({ status: Status.Waiting, message: message });
            return;
          // 세차장 승인 거부
          case 1502:
            setStoreStatus({ status: Status.Abort, message: message, reason: reason });
            return;
          // 정상적인 접근 아님
          default:
            throw new Error(message);
        }
      } else {
        throw new Error('잘못된 응답');
      }
    };

    const getRequestList = async () => {
      const response = await authClient.get(`/provider/${slug}/request`);
      const list: RequestDto[] = response?.data.list;
      console.debug(`GET /provider/${slug}/request`, list);
    };

    const getScheduleList = async () => {
      const response = await authClient.get(`/provider/${slug}/schedule`);
      const list: ScheduleDto[] = response?.data.list;
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

  const RenderStatus = () => {
    switch (storeStatus.status) {
      case Status.Loading:
        return (
          <Alert className="text-center">
            <Loading />
          </Alert>
        );
      case Status.Operation:
        return (
          <Alert variant="success" className="text-center">
            {storeStatus.message}
          </Alert>
        );
      case Status.Waiting:
        return (
          <Alert variant="primary" className="text-center">
            {storeStatus.message}
          </Alert>
        );
      case Status.Abort:
        return (
          <Alert variant="danger" className="text-center">
            {storeStatus.message}
            이유 : {storeStatus.reason}
          </Alert>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>세차새차 - 대시보드</title>
      </Head>
      <LoginCheck>
        <Container className="pt-4">
          <RenderStatus />

          <Row>
            <Col md className="mt-4">
              <div>
                <h5 className="fw-bold">세차 예약 요청</h5>
                <List />
              </div>
            </Col>
            <Col md className="mt-4">
              <div>
                <h5 className="fw-bold">오늘의 세차 스케줄</h5>
                <List />
              </div>
            </Col>
          </Row>

          <h5 className="fw-bold mt-4">매장 관리</h5>
          <Row>
            <Col sm className="mt-2">
              <Button
                className="w-100"
                variant="outline-secondary"
                onClick={() => {
                  router.push(`/provider/${slug}/store`);
                }}
              >
                매장 정보 설정
              </Button>
            </Col>
            <Col sm className="mt-2">
              <Button
                className="w-100"
                variant="outline-secondary"
                onClick={() => {
                  router.push(`/provider/${slug}/menu`);
                }}
              >
                메뉴 관리
              </Button>
            </Col>
            <Col sm className="mt-2">
              <Button
                className="w-100"
                variant="outline-secondary"
                onClick={() => {
                  router.push(`/provider/${slug}/time`);
                }}
              >
                매장 운영 시간 설정
              </Button>
            </Col>
          </Row>
        </Container>
      </LoginCheck>
    </>
  );
}

function List() {
  const router = useRouter();

  return (
    <ListGroup>
      <ListGroup.Item action onClick={() => router.push('/provider/hello/reservation/1')}>
        <div className="d-flex justify-content-between">
          <div>
            <div>외부 세차</div>
            <div className="fs-5 fw-bold">기아 EV6 / 31하 1450</div>
            <div>{moment().format('YYYY.MM.DD(dd) HH:mm')}</div>
          </div>
          <div className="d-flex align-items-center">
            <IoIosArrowForward size={25} />
          </div>
        </div>
      </ListGroup.Item>
    </ListGroup>
  );
}
