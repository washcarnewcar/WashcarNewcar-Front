import { AxiosError } from 'axios';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Button, Form, Toast, ToastContainer } from 'react-bootstrap';
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

export default function Password() {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);

  const handleSubmit = async (
    values: Values,
    { setSubmitting, setErrors }: FormikHelpers<Values>
  ) => {
    setSubmitting(true);

    // form data 생성
    const form = new FormData();
    form.append('id', values.email);
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
          password: '아이디 또는 비밀번호가 틀렸습니다.',
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
          <div className={styles.title}>비밀번호 재설정</div>

          <Form className={styles.form} onSubmit={formik.handleSubmit}>
            <Form.Group>
              <Form.Text>이메일 주소를 입력해주세요</Form.Text>
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
            <Button
              variant="primary"
              type="submit"
              className={styles.submit_button}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <BeatLoader color="white" size={10} />
              ) : (
                '메일 보내기'
              )}
            </Button>
          </Form>
        </div>
      </div>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast>
          <Toast.Header>세차새차</Toast.Header>
          <Toast.Body>안녕하세요</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}
