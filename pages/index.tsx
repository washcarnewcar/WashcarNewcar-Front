import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Col, Container, Row } from 'react-bootstrap';
import Header from '../src/components/Header';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>세차새차 - 손세차 중계 플랫폼</title>
      </Head>
      <Header />
      <Container>
        <Container>
          <Row>
            <Col sm className="mt-4">
              <Button
                variant="light"
                className="shadow rounded-3 p-3 w-100 h-100"
                onClick={() => router.push('/search')}
              >
                <div className="fs-2 fw-bold">세차하기</div>
                <div className="text-secondary">내 주변 세차장 찾기</div>
              </Button>
            </Col>
            <Col sm className="mt-4">
              <Button variant="light" className="shadow rounded-3 p-3 w-100 h-100" onClick={() => router.push('/find')}>
                <div className="fs-2 fw-bold" style={{ wordBreak: 'keep-all' }}>
                  예약 확인하기
                </div>
              </Button>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <Button
                variant="light"
                className="shadow rounded-3 p-3 w-100 h-100"
                onClick={() => router.push('/provider')}
              >
                <div className="fs-2 fw-bold">매장 관리하기</div>
                <div className="text-secondary">세차장 사장님이신가요?</div>
              </Button>
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );
}
