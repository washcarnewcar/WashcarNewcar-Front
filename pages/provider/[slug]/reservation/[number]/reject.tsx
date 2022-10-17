import { useRouter } from 'next/router';
import { Button, Form } from 'react-bootstrap';
import Header from '../../../../../components/header';
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
      <Header type={1} />
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
    </>
  );
}
