import Link from 'next/link';
import { Button, Form } from 'react-bootstrap';
import styles from '../../styles/Login.module.scss';

function Login() {
  return (
    <>
      <div className={styles.container}>
        <Link href="/">
          <a className={styles.logo_container}>
            <img
              src="/row_logo.png"
              alt="세차새차"
              className={styles.img_logo}
            />
          </a>
        </Link>

        <div className={styles.form_container}>
          <div className={styles.title}>로그인</div>
          <Form className={styles.form}>
            <Form.Control
              type="text"
              className={styles.id}
              placeholder="아이디"
            />
            <Form.Control
              type="password"
              className={styles.pw}
              placeholder="비밀번호"
            />
            <Button
              variant="primary"
              type="submit"
              className={styles.login_button}
            >
              로그인
            </Button>
            <a href={process.env.REACT_APP_API + '/oauth2/authorization/kakao'}>
              <img
                src="/kakao_login_large_wide.png"
                alt="카카오 로그인"
                className={styles.kakao_login}
              ></img>
            </a>

            <div className={styles.signup}>
              <div>아직 계정이 없으신가요?</div>
              <Link href="/auth/signup">
                <a className={styles.signup_button}>회원가입</a>
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}

export default Login;
