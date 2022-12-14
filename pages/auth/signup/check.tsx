import { FormikHelpers, useFormik } from 'formik';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Form } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import { number, object } from 'yup';
import AuthHeader from '../../../src/components/AuthHeader';
import { client, server } from '../../../src/function/request';
import styles from '../../../styles/Auth.module.scss';

interface Values {
  number: string;
}

const initialValues: Values = {
  number: '',
};

const schema = object({
  number: number().typeError('숫자만 입력할 수 있습니다.').required('인증번호를 정확하게 입력해주세요'),
});

export default function SigninCheck() {
  const router = useRouter();
  const { email } = router.query;

  const handleSubmit = async (values: Values, { setSubmitting, setErrors }: FormikHelpers<Values>) => {
    setSubmitting(true);

    const data = {
      email: email,
      number: values.number,
    };
    console.debug(`POST /signup/check/number`, data);
    const response = await client.post(`/signup/check/number`, data);
    const status = response?.data?.status;
    const message = response?.data?.message;
    if (status && message) {
      switch (status) {
        // 인증번호 유효
        case 2700:
          router.push(`/auth/signup/info`, {
            query: { email: email, number: values.number },
          });
          return;
        // 유효하지 않은 인증번호
        case 2701:
          setErrors({ number: '유효하지 않은 인증번호입니다.' });
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
      <div className={styles.container}>
        <AuthHeader />

        <div className={styles.form_container}>
          <div className={styles.title}>회원가입</div>

          <Form className={styles.form} onSubmit={formik.handleSubmit}>
            <Form.Group>
              <Form.Control className={styles.inputs} value={email || ''} disabled isValid={true} />
              <Form.Control.Feedback type="valid">이메일로 인증번호를 보냈습니다.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Control
                className={styles.inputs}
                value={formik.values.number}
                onChange={formik.handleChange}
                name="number"
                isInvalid={!!formik.errors.number && formik.touched.number}
                placeholder="인증번호"
              />
              <Form.Control.Feedback type="invalid">{formik.errors.number}</Form.Control.Feedback>
              <Form.Text>이메일로 전송된 인증번호를 입력해주세요.</Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit" className={styles.submit_button} disabled={formik.isSubmitting}>
              {formik.isSubmitting ? <BeatLoader color="white" size={10} /> : '확인'}
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { email } = context.query;
  if (!email) {
    return { redirect: { destination: `/`, statusCode: 302 } };
  }

  const response = await server.post(`/signup/check/email`, { data: { email: email } });
  const status = response?.data?.status;
  const message = response?.data?.message;
  if (status && message) {
    switch (status) {
      // email 유효
      case 1700:
        return { props: {} };
      // email 유효하지 않음
      case 1701:
      case 1702:
      default:
        throw new Error(message);
    }
  } else {
    throw new Error('잘못된 응답');
  }
};
