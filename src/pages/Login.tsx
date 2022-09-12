import Header from '../components/Header';
import styles from './Login.module.scss';

const Login = () => {
  return (
    <>
      <div className={styles.container}>
        <img
          src="이미지+텍스트로고.png"
          alt="메인로고"
          className={styles.logo}
        />

        <a href={process.env.REACT_APP_API + '/oauth2/authorization/kakao'}>
          <img
            src="kakao_login_large_wide.png"
            alt="카카오 로그인"
            className={styles.login_button}
          ></img>
        </a>
      </div>
    </>
  );
};

export default Login;
