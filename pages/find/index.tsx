import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
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

  return (
    <>
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
