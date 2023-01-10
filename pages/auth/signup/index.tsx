import { FormikHelpers, useFormik } from 'formik';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Container, Form } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import { object, string } from 'yup';
import AuthHeader from '../../../src/components/AuthHeader';
import { client } from '../../../src/function/request';

interface Values {
  email: string;
}

const initialValues: Values = {
  email: '',
};

const schema = object().shape({
  email: string().required('이메일을 입력해주세요').email('이메일 형식에 맞지 않습니다'),
});

export default function SignUp() {
  const router = useRouter();

  const handleSubmit = async (values: Values, { setSubmitting, setErrors }: FormikHelpers<Values>) => {
    setSubmitting(true);

    const response = await client.post(`/signup/check/email`, {
      email: values.email,
    });
    console.debug(`POST /signup/check/email`, response?.data);
    const status = response?.data?.status;
    const message = response?.data?.message;
    if (status && message) {
      switch (status) {
        // email 전송함
        case 1700:
          router.push(`/auth/signup/check`, {
            query: { email: values.email },
          });
          return;
        // email 중복
        case 1701:
          setErrors({ email: '이미 사용중인 이메일입니다' });
          break;
        // email 형식에 맞지 않음
        case 1702:
          setErrors({ email: '이메일 형식에 맞지 않습니다' });
          break;
        default:
          throw new Error(message);
      }
    } else {
      throw new Error('잘못된 응답');
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
        <title>세차새차 - 회원가입</title>
      </Head>
      <Container className="pt-5 d-flex flex-column align-items-center">
        <AuthHeader />

        <div className="mt-5 tw-w-[300px]">
          <h1 className="fw-bold">회원가입</h1>

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
              />
              <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="d-flex align-items-center justify-content-center tw-h-[45px]"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? <BeatLoader color="white" size={10} /> : '시작하기'}
            </Button>
            <a href={process.env.NEXT_PUBLIC_API + '/oauth2/authorization/kakao'}>
              <Image src="/kakao_login_large_wide.png" alt="카카오 로그인" height={45} width={300} priority />
            </a>

            <div className="d-flex justify-content-between">
              <div>이미 계정이 있으신가요?</div>
              <Link href="/auth/login" className="text-decoration-none">
                로그인
              </Link>
            </div>
          </Form>
        </div>
      </Container>
    </>
  );
}
