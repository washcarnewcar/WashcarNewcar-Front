import { AxiosError } from 'axios';
import { FormikHelpers, useFormik } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import { object, string } from 'yup';
import AuthHeader from '../../src/components/AuthHeader';
import UserContext from '../../src/context/UserProvider';
import { client } from '../../src/function/request';
import styles from '../../styles/Auth.module.scss';

interface Values {
  email: string;
  password: string;
}

const initialValues: Values = {
  email: '',
  password: '',
};

const schema = object().shape({
  email: string()
    .required('이메일을 입력해주세요')
    .email('이메일 형식이 아닙니다'),
  password: string().required('비밀번호를 입력해주세요'),
});

function Login() {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);

  const handleSubmit = async (
    values: Values,
    { setSubmitting, setErrors }: FormikHelpers<Values>
  ) => {
    setSubmitting(true);

    // form data 생성
    const form = new FormData();
    form.append('email', values.email);
    form.append('password', values.password);

    // 로그인 요청
    try {
      const response = await client.post(`/login`, form);

      // 토큰 저장
      const token = response.data.access_token;
      const refToken = response.data.refresh_token;
      localStorage.setItem('token', token);
      localStorage.setItem('refresh_token', refToken);

      setUser({ isLogined: true });

      // 홈화면으로
      router.replace('/');
    } catch (error) {
      // 사용자 정보가 없을 시
      if (error instanceof AxiosError && error.response?.status === 401) {
        setErrors({
          email: ' ',
          password: '이메일 또는 비밀번호가 틀렸습니다.',
        });
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
        console.error(error);
      }
    }
    setSubmitting(false);
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleSubmit,
    validationSchema: schema,
  });

  return (
    <>
      <div className={styles.container}>
        <AuthHeader />

        <div className={styles.form_container}>
          <div className={styles.title}>로그인</div>

          <Form className={styles.form} onSubmit={formik.handleSubmit}>
            <Form.Group>
              <Form.Control
                type="email"
                className={styles.inputs}
                placeholder="이메일"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                isInvalid={!!formik.errors.email && formik.touched.email}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Control
                type="password"
                className={styles.inputs}
                placeholder="비밀번호"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                isInvalid={!!formik.errors.password && formik.touched.password}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className={styles.submit_button}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <BeatLoader color="white" size={10} />
              ) : (
                '로그인'
              )}
            </Button>
            <a
              href={process.env.NEXT_PUBLIC_API + '/oauth2/authorization/kakao'}
            >
              <Image
                src="/kakao_login_large_wide.png"
                alt="카카오 로그인"
                height={45}
                width={300}
              />
            </a>

            <div className={styles.change}>
              <div>아직 계정이 없으신가요?</div>
              <Link href="/auth/signup">
                <a className={styles.change_text}>회원가입</a>
              </Link>
            </div>
            <div className={styles.change}>
              <div>비밀번호를 잊으셨나요?</div>
              <Link href="/auth/password">
                <a className={styles.change_text}>비밀번호 재설정</a>
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}

export default Login;
