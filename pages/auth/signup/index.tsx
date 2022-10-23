import Image from 'next/image';
import Link from 'next/link';
import { Button, Form } from 'react-bootstrap';
import styles from '../../../styles/SignUp.module.scss';

export default function SignUp() {
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
            <Form.Group className={styles.id_group}>
              <Form.Control
                type="text"
                className={styles.id}
                placeholder="사용할 아이디"
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className={styles.login_button}
            >
              회원가입
            </Button>
            <a href={process.env.REACT_APP_API + '/oauth2/authorization/kakao'}>
              <Image
                src="/kakao_login_large_wide.png"
                alt="카카오 로그인"
                height={45}
                width={300}
                className={styles.kakao_login}
              />
            </a>

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
