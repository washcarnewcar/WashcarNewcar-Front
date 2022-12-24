import { FormikHelpers, useFormik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { IoClose, IoImage } from 'react-icons/io5';
import styles from '../../styles/MenuForm.module.scss';
import { MenuDto } from '../dto';
import { compressImage } from '../function/processingImage';
import { authClient } from '../function/request';
import { uploadImage } from '../function/S3Utils';
import Loading from './Loading';

interface MenuFormProps {
  data: MenuDto | null | undefined;
}

interface Values {
  name: string;
  description: string;
  price: number;
  hour: number;
  minute: number;
}

interface Errors {
  name?: string;
  description?: string;
  price?: string;
  hour?: string;
  minute?: string;
}

interface Images {
  file: File | null;
  uploaded: boolean;
  previewUrl: string;
}

const initialValues: Values = {
  name: '',
  description: '',
  price: 0,
  hour: 0,
  minute: 0,
};

export default function MenuForm({ data }: MenuFormProps) {
  const router = useRouter();
  const { slug, number } = router.query;
  const inputFile = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<Images>({
    file: null,
    uploaded: false,
    previewUrl: '',
  });
  const [ready, setReady] = useState(false);

  const handleSubmit = async (
    values: Values,
    { setErrors, setSubmitting }: FormikHelpers<Values>
  ) => {
    setSubmitting(true);

    // aws 이미지 업로드
    let imageUrl;
    try {
      imageUrl = await uploadImage(image, 'menuImages');
    } catch (error) {
      alert('이미지 업로드에 오류가 발생했습니다.\n다시 시도해주세요.');
      setSubmitting(false);
      return;
    }

    const menuDto: MenuDto = {
      image: imageUrl,
      name: values.name,
      description: values.description,
      price: values.price,
      expected_hour: values.hour,
      expected_minute: values.minute,
    };

    try {
      // 수정 요청일 때
      if (data) {
        const response = await authClient.put(
          `/provider/menu/${number}`,
          menuDto
        );
        console.debug(`PUT /provider/menu/${number}`, menuDto);
        const data = response?.data;
        console.debug(data);
        switch (data?.status) {
          case 2400:
            alert('수정되었습니다.');
            router.push(`/provider/${slug}/menu`);
            return;
          case 2401:
            alert('필수 정보가 입력되지 않았습니다.');
            return;
          default:
            alert('오류가 발생했습니다. 다시 시도해주세요.');
            return;
        }
      }

      // 생성 요청일 때
      else if (data === null) {
        const response = await authClient.post(
          `provider/${slug}/menu`,
          menuDto
        );
        console.debug(`POST provider/${slug}/menu`, menuDto);
        const data = response?.data;
        console.debug(data);
        switch (data?.status) {
          case 2200:
            alert('추가되었습니다.');
            router.push(`/provider/${slug}/menu`);
            return;
          case 2201:
            alert('필수 정보가 입력되지 않았습니다.');
            return;
          default:
            alert('오류가 발생했습니다. 다시 시도해주세요.');
            return;
        }
      }
    } catch (error) {
      console.error(error);
    }

    setSubmitting(false);
  };

  const validate = (values: Values) => {
    const newErrors: Errors = {};

    if (!values.name) {
      newErrors.name = '메뉴 이름을 입력해주세요';
    }

    if (!values.description) {
      newErrors.description = '메뉴 설명을 입력해주세요';
    }

    if (values.price === 0 || !values.price) {
      newErrors.price = '메뉴 가격을 입력해주세요';
    }

    if (values.hour === 0 && values.minute === 0) {
      newErrors.hour = ' ';
      newErrors.minute = ' ';
    }

    return newErrors;
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleSubmit,
    validate: validate,
  });

  const handleDeleteClick = async () => {
    try {
      const response = await authClient.delete(`/provider/menu/${number}`);
      const data = response?.data;
      switch (data?.status) {
        case 2300:
          alert('삭제되었습니다.');
          router.replace(`/provider/${slug}/menu`);
          return;
        default:
          alert('오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * 이미지를 선택했을 때
   */
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files ? e.target.files[0] : null;

    // 파일을 넣지 않은 경우
    if (!file) {
      setImage({ file: null, uploaded: false, previewUrl: '' });
      return;
    }

    // 이미지 형식이 아닌 경우
    if (!(file.type === 'image/jpeg' || file.type === 'image/png')) {
      alert('jpg, png 파일만 업로드 가능합니다.');
      return;
    }

    // 파일이 5MB를 넘은 경우 => 압축
    if (file.size > 1024 * 1024 * 5) {
      try {
        file = await compressImage(file);
      } catch (error) {
        alert('압축 과정에서 오류가 발생했습니다.');
        return;
      }
    }

    setImage({
      file: file,
      uploaded: false,
      previewUrl: URL.createObjectURL(file),
    });
  };

  /**
   * 사진 삭제 버튼을 눌렀을 때
   */
  const handleImageDeleteClick = () => {
    setImage({
      file: null,
      uploaded: false,
      previewUrl: '',
    });
  };

  const generateHour = () => {
    const arr = [];
    for (let i = 0; i <= 24; i++) {
      arr.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return arr;
  };

  const generateMinute = () => {
    const arr = [];
    for (let i = 0; i <= 59; i += 5) {
      arr.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return arr;
  };

  const setData = (data: MenuDto) => {
    formik.setValues({
      name: data.name,
      description: data.description,
      price: data.price,
      hour: data.expected_hour,
      minute: data.expected_minute,
    });
    setImage({ file: null, uploaded: true, previewUrl: data.image });
  };

  /**
   * API로부터 불러온 data에 따라서 input 채우기
   * data가 null일때는 new => 바로 띄움
   * data가 undifind일때는 데이터 로딩중
   * data가 둘 다 아닐 때에는 로딩 되었음 => ipnut에 넣어주고 띄움
   */
  useEffect(() => {
    if (data === null) {
      setReady(true);
    } else if (data) {
      setData(data);
      setReady(true);
    }
  }, [data]);

  if (!ready) {
    <Loading fullscreen />;
  }

  return (
    <div className={styles.container}>
      <Form onSubmit={formik.handleSubmit}>
        <div className={styles.image_container}>
          <div className={styles.image_wrapper}>
            {image.previewUrl ? (
              <>
                <label htmlFor="file" className={styles.change_wrapper}>
                  <IoImage size="100%" />
                </label>
                <button
                  className={styles.delete_button}
                  onClick={handleImageDeleteClick}
                >
                  <IoClose />
                </button>
                <Image
                  src={
                    image.uploaded
                      ? process.env.NEXT_PUBLIC_S3_URL + image.previewUrl
                      : image.previewUrl
                  }
                  alt=""
                  width={200}
                  height={200}
                  className={styles.image}
                />
              </>
            ) : (
              <>
                <label htmlFor="file" className={styles.no_image_wrapper}>
                  <IoImage size="80px" />
                </label>
              </>
            )}
            <input
              type="file"
              id="file"
              style={{ display: 'none' }}
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
              ref={inputFile}
            />
          </div>
        </div>

        {/* 메뉴 이름 */}
        <Form.Group className={styles.form_group}>
          <Form.Label>메뉴 이름</Form.Label>
          <Form.Control
            type="text"
            placeholder="메뉴 이름을 입력해주세요"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.name && formik.touched.name}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.name}
          </Form.Control.Feedback>
        </Form.Group>

        {/* 메뉴 설명 */}
        <Form.Group className={styles.form_group}>
          <Form.Label>메뉴 설명</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="메뉴의 설명을 입력해주세요"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            isInvalid={
              !!formik.errors.description && formik.touched.description
            }
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.name}
          </Form.Control.Feedback>
        </Form.Group>

        {/* 메뉴 가격 */}
        <Form.Group className={styles.form_group}>
          <Form.Label>메뉴 가격</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type="number"
              inputMode="numeric"
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.price && formik.touched.price}
            />
            <InputGroup.Text>원</InputGroup.Text>
            <Form.Control.Feedback type="invalid">
              {formik.errors.price}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        {/* 예상 시간 */}
        <Form.Group className={styles.form_group}>
          <Form.Label>예상 시간</Form.Label>
          <div className={styles.time}>
            <InputGroup>
              <Form.Select
                name="hour"
                value={formik.values.hour}
                onChange={formik.handleChange}
                isInvalid={!!formik.errors.hour && formik.touched.hour}
              >
                {generateHour()}
              </Form.Select>
              <InputGroup.Text>시간</InputGroup.Text>
            </InputGroup>
            <InputGroup>
              <Form.Select
                name="minute"
                value={formik.values.minute}
                onChange={formik.handleChange}
                isInvalid={!!formik.errors.minute && formik.touched.minute}
              >
                {generateMinute()}
              </Form.Select>
              <InputGroup.Text>분</InputGroup.Text>
            </InputGroup>
          </div>
        </Form.Group>

        <div className={styles.button_group}>
          {ready ? (
            data ? (
              <>
                <Button
                  type="button"
                  variant="outline-danger"
                  className={styles.button}
                  onClick={handleDeleteClick}
                >
                  삭제
                </Button>
                <Button type="submit" className={styles.button}>
                  수정
                </Button>
              </>
            ) : (
              <Button type="submit" className={styles.button}>
                등록
              </Button>
            )
          ) : null}
        </div>
      </Form>
    </div>
  );
}
