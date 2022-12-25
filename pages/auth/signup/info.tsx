import { FormikHelpers, useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import { object, ref, string } from 'yup';
import AuthHeader from '../../../src/components/AuthHeader';
import styles from '../../../styles/Auth.module.scss';

interface Values {
  email: string;
  password: string;
  passwordConfirm: string;
}

const initialValues: Values = {
  email: '',
  password: '',
  passwordConfirm: '',
};

const schema = object().shape({
  email: string()
    .required('이메일을 입력해주세요')
    .email('이메일 형식이 아닙니다'),
  password: string().required('비밀번호를 입력해주세요'),
  passwordConfirm: string()
    .required('비밀번호 확인을 입력해주세요')
    .oneOf([ref('password')], '비밀번호가 다릅니다'),
});

function SignUpInfo() {
  const router = useRouter();
  const { email } = router.query;

  const handleSubmit = async (
    values: Values,
    { setSubmitting, setErrors }: FormikHelpers<Values>
  ) => {
    setSubmitting(true);

    // logic

    setSubmitting(false);
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleSubmit,
    validationSchema: schema,
  });

  useEffect(() => {
    if (!router.isReady) return;
    if (email) {
      formik.setValues((values) => ({ ...values, email: email as string }));
    }
  }, [router.isReady]);

  return (
    <>
      <div className={styles.container}>
        <AuthHeader />

        <div className={styles.form_container}>
          <div className={styles.title}>회원가입</div>

          <Form className={styles.form} onSubmit={formik.handleSubmit}>
            <Form.Group>
              <Form.Control
                placeholder="이메일"
                type="email"
                name="email"
                className={styles.inputs}
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
                name="password"
                className={styles.inputs}
                placeholder="비밀번호"
                value={formik.values.password}
                onChange={formik.handleChange}
                isInvalid={!!formik.errors.password && formik.touched.password}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.password}
              </Form.Control.Feedback>
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
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.passwordConfirm}
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
                '회원가입'
              )}
            </Button>

            <div className={styles.change}>
              <div>이미 계정이 있으신가요?</div>
              <Link href="/auth/login" className={styles.change_text}>
                로그인
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}

export default SignUpInfo;
