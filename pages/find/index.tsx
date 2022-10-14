import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Header from '../../components/header';
import styles from '../../styles/Find.module.scss';

function Find() {
  const router = useRouter();
  const [phone, setPhone] = useState('');

  function onPhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhone(e.target.value);
  }

  function onSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push(`/find/${phone}`);
  }

  return (
    <>
      <Header type={1} />
      <div className={styles.body}>
        <form className={styles.form} onSubmit={onSubmit}>
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
        </form>
      </div>
    </>
  );
}

export default Find;
