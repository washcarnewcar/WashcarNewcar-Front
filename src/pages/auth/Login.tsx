import { Button, FloatingLabel, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import styles from './Login.module.scss';

const Login = () => {
  return (
    <>
      <div className={styles.container}>
        <Link to="/" className={styles.logo_container}>
          <img src="main_logo.png" alt="로고" className={styles.img_logo} />
          <div className={styles.text_logo}>세차새차</div>
        </Link>

        <div className={styles.form_container}>
          <div className={styles.title}>로그인</div>
          <Form className={styles.form}>
            <Form.Group className={styles.id_group}>
              <Form.Control
                type="text"
                className={styles.id}
                placeholder="아이디"
              />
            </Form.Group>
            <Form.Group className={styles.pw_group}>
              <Form.Control
                type="password"
                className={styles.pw}
                placeholder="비밀번호"
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className={styles.login_button}
            >
              로그인
            </Button>
            <a href={process.env.REACT_APP_API + '/oauth2/authorization/kakao'}>
              <img
                src="kakao_login_large_wide.png"
                alt="카카오 로그인"
                className={styles.kakao_login}
              ></img>
            </a>

            <div className={styles.signup}>
              <div>아직 계정이 없으신가요?</div>
              <Link to="/signup" className={styles.signup_button}>
                회원가입
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
