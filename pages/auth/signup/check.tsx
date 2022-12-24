import { FormikHelpers, useFormik } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import { number, object, string } from 'yup';
import AuthHeader from '../../../src/components/AuthHeader';
import { client } from '../../../src/function/request';
import styles from '../../../styles/Auth.module.scss';

interface Values {
  number: string;
}

const initialValues: Values = {
  number: '',
};

const schema = object().shape({
  number: number().required('이메일로 전송된 숫자를 입력해주세요'),
});

export default function SigninCheck() {
  const router = useRouter();
  const { email } = router.query;
  const [checked, setChecked] = useState(false);

  const handleSubmit = async (
    values: Values,
    { setSubmitting, setErrors }: FormikHelpers<Values>
  ) => {
    setSubmitting(true);

    const data = {
      email: email,
      number: values.number,
    };
    console.debug(`POST /signup/check/number`, data);
    const response = await client.post(`/signup/check/number`, data);
    const status: number | undefined = response?.data?.status;
    if (status) {
      switch (status) {
        // email 전송함
        case 2700:
          setChecked(true);
          return;
        // email 중복
        case 2701:
          setErrors({ number: '유효하지 않은 인증번호입니다.' });
          break;
        default:
          console.error('알 수 없는 상태코드');
      }
    } else {
      console.error('잘못된 응답');
    }

    setSubmitting(false);
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleSubmit,
    validationSchema: schema,
  });

  return (
    <div className={styles.container}>
      <AuthHeader />

      <div className={styles.form_container}>
        <div className={styles.title}>회원가입</div>

        <Form className={styles.form} onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Control className={styles.inputs} value={email} disabled />
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
          <a href={process.env.NEXT_PUBLIC_API + '/oauth2/authorization/kakao'}>
            <Image
              src="/kakao_login_large_wide.png"
              alt="카카오 로그인"
              height={45}
              width={300}
              priority
            />
          </a>

          <div className={styles.change}>
            <div>이미 계정이 있으신가요?</div>
            <Link href="/auth/login" className={styles.change_text}>
              로그인
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
