import { FormikHelpers, useFormik } from 'formik';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { number, object } from 'yup';
import Header from '../../src/components/Header';

interface Values {
  tel1: string;
  tel2: string;
  tel3: string;
}

const initialValues: Values = {
  tel1: '',
  tel2: '',
  tel3: '',
};

const schema = object().shape({
  tel1: number().required(),
  tel2: number().required(),
  tel3: number().required(),
});

export default function Find() {
  const router = useRouter();
  const tel1Ref = useRef<HTMLInputElement>(null);
  const tel2Ref = useRef<HTMLInputElement>(null);
  const tel3Ref = useRef<HTMLInputElement>(null);

  const handleSubmit = async (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
    setSubmitting(true);
    router.push(`/find/${values.tel1}-${values.tel2}-${values.tel3}`);
    setSubmitting(false);
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleSubmit,
    validationSchema: schema,
  });

  // 자동 포커스 이동
  useEffect(() => {
    tel1Ref.current?.focus();
  }, []);

  useEffect(() => {
    if (formik.values.tel1.length === 3) {
      tel2Ref.current?.focus();
    }
  }, [formik.values.tel1]);

  useEffect(() => {
    if (formik.values.tel2.length === 4) {
      tel3Ref.current?.focus();
    }
  }, [formik.values.tel2]);

  return (
    <>
      <Head>
        <title>세차새차 - 세차 예약 확인</title>
      </Head>
      <Header />
      <Container className="pt-5 px-4 d-flex justify-content-center">
        <Form className="" onSubmit={formik.handleSubmit}>
          <h1 className="fw-bold mb-2 tw-break-keep">예약한 휴대폰 번호를 입력해주세요</h1>
          {/* 매장 전화번호 */}
          <Form.Group className="my-4">
            <div className="d-flex align-items-center gap-1">
              <Form.Control
                type="tel"
                name="tel1"
                placeholder="010"
                maxLength={3}
                value={formik.values.tel1}
                onChange={formik.handleChange}
                isInvalid={!!formik.errors.tel1 && formik.touched.tel1}
                ref={tel1Ref}
              />
              -
              <Form.Control
                type="tel"
                name="tel2"
                placeholder="0000"
                maxLength={4}
                value={formik.values.tel2}
                onChange={formik.handleChange}
                isInvalid={!!formik.errors.tel2 && formik.touched.tel2}
                ref={tel2Ref}
              />
              -
              <Form.Control
                type="tel"
                name="tel3"
                placeholder="0000"
                maxLength={4}
                value={formik.values.tel3}
                onChange={formik.handleChange}
                isInvalid={!!formik.errors.tel3 && formik.touched.tel3}
                ref={tel3Ref}
              />
            </div>
          </Form.Group>
          <Button variant="primary" className="w-100" type="submit" disabled={formik.isSubmitting}>
            확인
          </Button>
        </Form>
      </Container>
    </>
  );
}
