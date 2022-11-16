import { FormikHelpers, useFormik } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Form } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import { object, string } from 'yup';
import AuthHeader from '../../../src/components/AuthHeader';
import { client } from '../../../src/functions/request';
import styles from '../../../styles/Auth.module.scss';

interface Values {
  email: string;
}

const initialValues = {
  email: '',
};

const schema = object().shape({
  email: string()
    .required('이메일을 입력해주세요')
    .email('이메일 형식에 맞지 않습니다'),
});

export default function SignUp() {
  const router = useRouter();

  const handleSubmit = async (
    values: Values,
    { setSubmitting, setErrors }: FormikHelpers<Values>
  ) => {
    setSubmitting(true);

    console.log('submit!');
    try {
      const response = await client.get(`/signup/check`, {
        params: { email: values.email },
      });
      console.log(response);
      const status: number = response.data.status;
      // id 사용 가능
      if (status === 1700) {
        router.push(`/auth/signup/info`, { query: { email: values.email } });
      }
      // id 중복
      else if (status === 1701) {
        setErrors({ email: '이미 사용중인 이메일입니다' });
      }
      // id 형식에 맞지 않음
      else if (status === 1702) {
        setErrors({ email: '이메일 형식에 맞지 않습니다' });
      }
    } catch (error) {}

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
          <div className={styles.title}>회원가입</div>

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
            <Button
              variant="primary"
              type="submit"
              className={styles.submit_button}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <BeatLoader color="white" size={10} />
              ) : (
                '시작하기'
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
              <div>이미 계정이 있으신가요?</div>
              <Link href="/auth/login">
                <a className={styles.change_text}>로그인</a>
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
