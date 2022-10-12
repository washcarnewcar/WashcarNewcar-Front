import { InputHTMLAttributes, SyntheticEvent, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import styles from './Find.module.scss';

function Find() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');

  function onPhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhone(e.target.value);
  }

  function onSubmitClick() {
    navigate(`/find/${phone}`);
  }

  return (
    <>
      <Header type={1} />
      <div className={styles.body}>
        <Form className={styles.form}>
          <div className={styles.title}>예약한 휴대폰 번호를 입력해주세요</div>
          <Form.Control
            className={styles.phone}
            type="tel"
            placeholder="휴대폰 번호"
            as="input"
            onChange={onPhoneChange}
          ></Form.Control>
          <Button
            variant="primary"
            className={styles.submit}
            type="submit"
            onClick={onSubmitClick}
          >
            확인
          </Button>
        </Form>
      </div>
    </>
  );
}

export default Find;
