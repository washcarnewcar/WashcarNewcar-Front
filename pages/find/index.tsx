import { FormikHelpers, useFormik } from 'formik';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { number, object } from 'yup';
import Header from '../../src/components/Header';
import { authClient } from '../../src/function/request';
import styles from '../../styles/Find.module.scss';

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

  const handleSubmit = async (
    values: Values,
    { setSubmitting }: FormikHelpers<Values>
  ) => {
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
      <Header type={1} />
      <div className={styles.body}>
        <Form className={styles.form} onSubmit={formik.handleSubmit}>
          <div className={styles.title}>예약한 휴대폰 번호를 입력해주세요</div>
          {/* 매장 전화번호 */}
          <Form.Group className={styles.form_group}>
            <div className={styles.tel_wrapper}>
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
          <Button
            variant="primary"
            className={styles.submit}
            type="submit"
            disabled={formik.isSubmitting}
          >
            확인
          </Button>
        </Form>
      </div>
    </>
  );
}
