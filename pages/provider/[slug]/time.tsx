import Head from 'next/head';
import { Container, Tab, Tabs } from 'react-bootstrap';
import Except from '../../../src/components/Except';
import LoginCheck from '../../../src/components/LoginCheck';
import TimeList from '../../../src/components/TimeList';

export default function ProviderTime() {
  return (
    <>
      <Head>
        <title>세차새차 - 매장 운영 시간 설정</title>
      </Head>
      <LoginCheck>
        <Container className="pt-4">
          <h3 className="fw-bold">매장 운영 시간 설정</h3>
          <Tabs defaultActiveKey="time" className="mt-3" justify id="tabs">
            {/* 요일별 영업시간 렌더링 */}
            <Tab eventKey="time" title="요일별 영업 시간">
              <TimeList />
            </Tab>
            {/* 예외 일자 렌더링 */}
            <Tab eventKey="except" title="예외 일자">
              <Except />
            </Tab>
          </Tabs>
        </Container>
      </LoginCheck>
    </>
  );
}
