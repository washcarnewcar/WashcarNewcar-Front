import axios from 'axios';
import { Formik, FormikHelpers } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Form } from 'react-bootstrap';
import { object, string } from 'yup';
import styles from '../../../styles/SignUp.module.scss';

interface Values {
  id: string;
}

const initialValues = {
  id: '',
};

const schema = object({
  id: string().required('아이디를 입력해주세요'),
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
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/signup/check`,
        {
          params: { id: values.id },
        }
      );
      console.log(response);
      const status: number = response.data.status;
      // id 사용 가능
      if (status === 1700) {
        router.push(`/auth/signup/info`, { query: { id: values.id } });
      }
      // id 중복
      else if (status === 1701) {
        setErrors({ id: '이미 사용중인 아이디입니다' });
      }
      // id 형식에 맞지 않음
      else if (status === 1702) {
        setErrors({ id: '아이디 형식에 맞지 않습니다' });
      }
    } catch (error) {}

    setSubmitting(false);
  };

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

          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={schema}
          >
            {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
              <Form className={styles.form} onSubmit={handleSubmit}>
                <Form.Group className={styles.id_group}>
                  <Form.Control
                    type="text"
                    className={styles.id}
                    placeholder="사용할 아이디를 입력해주세요"
                    name="id"
                    value={values.id}
                    onChange={handleChange}
                    isInvalid={!!errors.id}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.id}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className={styles.login_button}
                  disabled={isSubmitting}
                >
                  회원가입
                </Button>
                <a
                  href={
                    process.env.NEXT_PUBLIC_API + '/oauth2/authorization/kakao'
                  }
                >
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
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
