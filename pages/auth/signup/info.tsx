import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import { object, ref, string } from 'yup';
import AuthHeader from '../../../src/components/AuthHeader';
import { client } from '../../../src/function/request';
import styles from '../../../styles/Auth.module.scss';

interface Values {
  password: string;
  passwordConfirm: string;
}

const initialValues: Values = {
  password: '',
  passwordConfirm: '',
};

const schema = object().shape({
  password: string().required('비밀번호를 입력해주세요'),
  passwordConfirm: string()
    .required('비밀번호 확인을 입력해주세요')
    .oneOf([ref('password')], '비밀번호가 다릅니다'),
});

function SignUpInfo() {
  const router = useRouter();
  const { email, number } = router.query;

  const handleSubmit = async (
    values: Values,
    { setSubmitting, setErrors }: FormikHelpers<Values>
  ) => {
    setSubmitting(true);

    const data = {
      email: email,
      number: number,
      password: values.password,
    };
    console.debug(`POST /signup`);
    const response = await client.post(`/signup`, data);
    const status: number | undefined = response?.data?.status;
    if (status) {
      switch (status) {
        // 회원가입 성공
        case 1800:
          alert('회원가입에 성공했습니다.\n로그인을 해주세요.');
          router.replace('/auth/login');
          return;
        // 회원가입 실패
        case 1801:
          alert('회원가입에 실패했습니다.');
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

  useEffect(() => {
    if (!router.isReady) return;
    if (!email || !number) {
      router.replace('/');
    }
  }, [router.isReady]);

  return (
    <div className={styles.container}>
      <AuthHeader />

      <div className={styles.form_container}>
        <div className={styles.title}>회원가입</div>

        <Form className={styles.form} onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Control
              className={styles.inputs}
              value={email || ''}
              disabled
              isValid={true}
            />
          </Form.Group>
          <Form.Group>
            <Form.Control
              className={styles.inputs}
              value={number || ''}
              disabled
              isValid={true}
            />
            <Form.Control.Feedback type="valid">
              이메일이 인증되었습니다.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Control
              type="password"
              name="password"
              className={styles.inputs}
              placeholder="비밀번호"
              value={formik.values.password}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.password && formik.touched.password}
              autoComplete="off"
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.password}
            </Form.Control.Feedback>
            <Form.Text>사용하실 비밀번호를 입력해주세요.</Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Control
              type="password"
              name="passwordConfirm"
              className={styles.inputs}
              placeholder="비밀번호 확인"
              value={formik.values.passwordConfirm}
              onChange={formik.handleChange}
              isInvalid={
                !!formik.errors.passwordConfirm &&
                formik.touched.passwordConfirm
              }
              autoComplete="off"
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.passwordConfirm}
            </Form.Control.Feedback>
            <Form.Text>비밀번호를 한번 더 입력해주세요.</Form.Text>
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
              '회원가입'
            )}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default SignUpInfo;
