import classNames from 'classnames';
import { FormikHelpers, useFormik } from 'formik';
import moment from 'moment';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Button, Container, Form, ListGroup } from 'react-bootstrap';
import Header from '../../../../../src/components/Header';
import Seperator from '../../../../../src/components/Seperator';
import { client } from '../../../../../src/function/request';
import styles from '../../../../../styles/Menu.module.scss';

const tempData = {
  title: '외부 세차',
  detail: `세차에 대한 설명
두줄 정도 표시할까 생각중`,
  price: 80000,
};

interface Values {
  date: Date | null;
  brandNumber: number;
  modelNumber: number;
  tel1: string;
  tel2: string;
  tel3: string;
  request: string;
}

const initialValues: Values = {
  date: null,
  brandNumber: 0,
  modelNumber: 0,
  tel1: '',
  tel2: '',
  tel3: '',
  request: '',
};

interface Errors {
  date: string;
  brandNumber: string;
  modelNumber: string;
  tel1: string;
  tel2: string;
  tel3: string;
}

interface Brand {
  number: number;
  name: string;
}

interface Model {
  number: number;
  name: string;
}

export default function Menu() {
  const router = useRouter();
  const { slug, number, date } = router.query;
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const tel2Ref = useRef<HTMLInputElement>(null);
  const tel3Ref = useRef<HTMLInputElement>(null);

  /**
   * 차 브랜드를 받아오는 함수
   */
  const getBrand = async () => {
    const response = await client.get(`/car/brand`);
    const { brand } = response?.data;
    console.debug(`GET /car/brand`, brand);
    if (brand) setBrands(brand);
  };

  /**
   * 차 모델을 받아오는 함수
   */
  const getModel = async (brandNumber: string) => {
    const response = await client.get(`/car/brand/${brandNumber}`);
    const { model } = response?.data;
    console.debug(`GET /car/brand/${brandNumber}`, model);
    if (model) setModels(model);
  };

  /**
   * 차 모델이 바뀌었을 때
   */
  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const index = e.target.selectedIndex;
    const text = e.target.options[index].text;

    if (index !== 0) {
      formik.setValues((values) => ({
        ...values,
        brandNumber: Number.parseInt(value),
      }));
      getModel(value);
    }
  };

  /**
   * 차 모델이 바뀌었을 때
   */
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const index = e.target.selectedIndex;
    const text = e.target.options[index].text;

    if (index !== 0) {
      formik.setValues((values) => ({
        ...values,
        modelNumber: Number.parseInt(value),
      }));
    }
  };

  const handleSubmit = (values: Values, { setSubmitting, setErrors }: FormikHelpers<Values>) => {
    setSubmitting(true);

    setSubmitting(false);
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    getBrand();
  }, []);

  useEffect(() => {
    if (!router.isReady) return;

    if (date && Date.parse(date as string)) {
      formik.setValues((values) => ({
        ...values,
        date: new Date(date as string),
      }));
    }
  }, [router.isReady]);

  // 전화번호 자동 포커스 이동
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
        <title>세차새차 - 세차 예약하기</title>
      </Head>
      <Header />

      <Container className="p-0">
        <div className="w-100 position-relative tw-h-48">
          <Image src="/style_carcare.jpg" alt="menu_image" fill className="tw-object-cover" />
        </div>
      </Container>
      <Container className="mt-3">
        <div className="shadow p-3 rounded-4 text-center tw-w-[80%] mx-auto">
          <h2 className="fw-bold">{tempData.title}</h2>
          <div className="tw-text-sm">{tempData.detail}</div>
        </div>

        <Form onSubmit={formik.handleSubmit}>
          <ListGroup variant="flush" className="mt-4">
            <ListGroup.Item className="d-flex justify-content-between">
              <h5 className="fw-bold">가격</h5>
              <h5 className="fw-bold">{Intl.NumberFormat().format(tempData.price)}원</h5>
            </ListGroup.Item>

            <ListGroup.Item>
              <Form.Group>
                <Form.Label>예약날짜 선택</Form.Label>
                <Button
                  onClick={() => router.push(`/store/${slug}/menu/${number}/time`)}
                  variant={formik.values.date ? 'secondary' : 'outline-secondary'}
                  className="w-100 tw-h-16"
                >
                  {formik.values.date
                    ? moment(formik.values.date).format('YYYY년 MM월 DD일 a hh시 mm분')
                    : '예약 날짜를 선택해주세요'}
                </Button>
              </Form.Group>
            </ListGroup.Item>

            <ListGroup.Item>
              <Form.Group>
                <Form.Label>차량 선택</Form.Label>
                <div className="d-flex justify-content-between gap-3">
                  <Form.Select className="text-center" onChange={handleBrandChange}>
                    <option value="select">브랜드 선택</option>
                    {brands.map((brand) => (
                      <option key={brand.number} value={brand.number}>
                        {brand.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Select className="text-center" onChange={handleModelChange}>
                    <option value="select">모델 선택</option>
                    {models.map((model) => (
                      <option key={model.number} value={model.number}>
                        {model.name}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Form.Group>
            </ListGroup.Item>

            <ListGroup.Item>
              <Form.Group>
                <Form.Label>휴대폰 번호</Form.Label>
                <div className="d-flex gap-2 align-items-center">
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
            </ListGroup.Item>

            <ListGroup.Item>
              <Form.Group>
                <Form.Label>요청사항</Form.Label>
                <Form.Control as="textarea" className="tw-resize-none tw-h-20" />
              </Form.Group>
            </ListGroup.Item>

            <div className="d-flex p-3 mt-3 w-100 ">
              <div className="tw-w-[70%] d-flex align-align-items-center justify-content-between fw-bold rounded-5 p-3 tw-border-solid tw-border-gray-300 tw-border-2 me-2 flex-shrink-0">
                <div>총 결제 금액</div>
                <div>{Intl.NumberFormat().format(tempData.price)}원</div>
              </div>
              <Button className="fw-bold rounded-5 w-100" type="submit" disabled={formik.isSubmitting}>
                예약하기
              </Button>
            </div>
          </ListGroup>
        </Form>
      </Container>
    </>
  );
}
