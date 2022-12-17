import { useRouter } from 'next/router';
import { Tab, Tabs } from 'react-bootstrap';
import Except from '../../../src/components/Except';
import LoginCheck from '../../../src/components/LoginCheck';
import TimeList from '../../../src/components/TimeList';
import styles from '../../../styles/ProviderTime.module.scss';

export default function ProviderTime() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <LoginCheck>
      <div className={styles.container}>
        <div className={styles.title}>매장 운영 시간 설정</div>
        <Tabs defaultActiveKey="time" className={styles.tabs} justify id="tabs">
          {/* 요일별 영업시간 렌더링 */}
          <Tab
            eventKey="time"
            title="요일별 영업 시간"
            tabClassName={styles.tab}
          >
            <TimeList />
          </Tab>
          {/* 예외 일자 렌더링 */}
          <Tab eventKey="except" title="예외 일자" tabClassName={styles.tab}>
            <Except />
          </Tab>
        </Tabs>
      </div>
    </LoginCheck>
  );
}
