import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import styles from '../../../styles/SignUpInfo.module.scss';

function SignUpInfo() {
  const [carrier, setCarrier] = useState('SKT');
  const [mobile, setMobile] = useState('010');

  function onCarrierSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    console.log(e.target.value);
    setCarrier(e.target.value);
  }

  function onMobileSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    console.log(e.target.value);
    setMobile(e.target.value);
  }

  return (
    <>
      <div className={styles.container}>
        <Link href="/">
          <a className={styles.logo_container}>
            <Image
              src="/row_logo.png"
              alt="세차새차"
              height={54}
              width={200}
              className={styles.img_logo}
            />
          </a>
        </Link>

        <div className={styles.form_container}>
          <div className={styles.title}>회원가입</div>
          <Form className={styles.form}>
            <Form.Group className={styles.pw_group}>
              <Form.Control
                type="password"
                className={styles.pw}
                placeholder="비밀번호"
              />
            </Form.Group>
            <Form.Group className={styles.pwcheck_group}>
              <Form.Control
                type="password"
                className={styles.pwcheck}
                placeholder="비밀번호 확인"
              />
            </Form.Group>
            <InputGroup className={styles.phone_group}>
              <Form.Select onChange={onCarrierSelect} className={styles.select}>
                <option value="SKT">SKT</option>
                <option value="KT">KT</option>
                <option value="LGU+">LGU+</option>
              </Form.Select>
              <Form.Select onChange={onMobileSelect} className={styles.select}>
                <option value="010">010</option>
                <option value="011">011</option>
                <option value="016">016</option>
                <option value="017">017</option>
                <option value="018">018</option>
                <option value="019">019</option>
              </Form.Select>
              <Form.Control
                type="number"
                className={styles.phone}
                placeholder="핸드폰 번호"
              />
            </InputGroup>
            <Button
              variant="primary"
              type="submit"
              className={styles.login_button}
            >
              회원가입
            </Button>

            <div className={styles.signup}>
              <div>이미 계정이 있으신가요?</div>
              <Link href="/auth/login">
                <a className={styles.signup_button}>로그인</a>
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}

export default SignUpInfo;
