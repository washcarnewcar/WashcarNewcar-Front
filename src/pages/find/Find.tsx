import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Form as RouterForm } from 'react-router-dom';
import Header from '../../components/Header';
import styles from './Find.module.scss';

function Find() {
  const [phone, setPhone] = useState('');

  function onPhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhone(e.target.value);
  }

  return (
    <>
      <Header type={1} />
      <div className={styles.body}>
        <RouterForm
          className={styles.form}
          method="get"
          action={`/find/${phone}`}
        >
          <div className={styles.title}>예약한 휴대폰 번호를 입력해주세요</div>
          <Form.Control
            className={styles.phone}
            type="tel"
            placeholder="휴대폰 번호"
            as="input"
            onChange={onPhoneChange}
          ></Form.Control>
          <Button variant="primary" className={styles.submit} type="submit">
            확인
          </Button>
        </RouterForm>
      </div>
    </>
  );
}

export default Find;
