import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Form } from 'react-bootstrap';
import LoginCheck from '../../../../../src/components/LoginCheck';
import styles from '../../../../../styles/Reject.module.scss';

export default function Reject() {
  const router = useRouter();

  function onClick() {
    if (confirm('정말로 예약 요청을 거부할까요?')) {
      router.push(`/reservation/1`);
    }
  }

  return (
    <>
      <Head>
        <title>세차새차 - 예약 확인</title>
      </Head>
      <LoginCheck>
        <div className={styles.container}>
          <div className={styles.title}>예약 요청 거부 사유 입력</div>
          <Form.Control
            as="textarea"
            className={styles.textarea}
            rows={5}
          ></Form.Control>
          <Button variant="danger" className={styles.button} onClick={onClick}>
            요청 거부
          </Button>
        </div>
      </LoginCheck>
    </>
  );
}
