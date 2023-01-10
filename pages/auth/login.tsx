import { AxiosError } from 'axios';
import { FormikHelpers, useFormik } from 'formik';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import { object, string } from 'yup';
import AuthHeader from '../../src/components/AuthHeader';
import UserContext from '../../src/context/UserProvider';
import { client } from '../../src/function/request';

interface Values {
  email: string;
  password: string;
}

const initialValues: Values = {
  email: '',
  password: '',
};

const schema = object().shape({
  email: string().required('이메일을 입력해주세요').email('이메일 형식이 아닙니다'),
  password: string().required('비밀번호를 입력해주세요'),
});

export default function Login() {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);

  const handleSubmit = async (values: Values, { setSubmitting, setErrors }: FormikHelpers<Values>) => {
    setSubmitting(true);

    // form data 생성
    const form = new FormData();
    form.append('email', values.email);
    form.append('password', values.password);

    // 로그인 요청
    try {
      // withCredentials 옵션을 붙혀주면 알아서 쿠키가 설정된다.
      await client.post(`/login`, form, { withCredentials: true });
      setUser({ isLogined: true });
      router.replace('/');
    } catch (error) {
      // 사용자 정보가 없을 시
      if (error instanceof AxiosError && error.response?.status === 401) {
        setErrors({
          email: ' ',
          password: '이메일 또는 비밀번호가 틀렸습니다.',
        });
      } else {
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
      <Head>
        <title>세차새차 - 로그인</title>
      </Head>
      <Container className="pt-5 d-flex flex-column align-items-center">
        <AuthHeader />

        <div className="mt-5 tw-w-[300px]">
          <h1 className="fw-bold">로그인</h1>

          <Form className="d-flex flex-column mt-3 gap-2" onSubmit={formik.handleSubmit}>
            <Form.Group>
              <Form.Control
                type="email"
                className="tw-h-[45px]"
                placeholder="이메일"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                isInvalid={!!formik.errors.email && formik.touched.email}
                autoComplete="on"
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                type="password"
                className="tw-h-[45px]"
                placeholder="비밀번호"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                isInvalid={!!formik.errors.password && formik.touched.password}
                autoComplete="on"
              />
              <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="d-flex align-items-center justify-content-center tw-h-[45px]"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? <BeatLoader color="white" size={10} /> : '로그인'}
            </Button>
            <a href={process.env.NEXT_PUBLIC_API + '/oauth2/authorization/kakao'}>
              <Image src="/kakao_login_large_wide.png" alt="카카오 로그인" height={45} width={300} priority />
            </a>

            <div className="d-flex justify-content-between">
              <div>아직 계정이 없으신가요?</div>
              <Link className="text-decoration-none" href="/auth/signup">
                회원가입
              </Link>
            </div>
            <div className="d-flex justify-content-between">
              <div>비밀번호를 잊으셨나요?</div>
              <Link className="text-decoration-none" href="/auth/password">
                비밀번호 재설정
              </Link>
            </div>
          </Form>
        </div>
      </Container>
    </>
  );
}
