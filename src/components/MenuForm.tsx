import { FormikHelpers, useFormik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { IoClose, IoImage } from 'react-icons/io5';
import { number, object, string } from 'yup';
import styles from '../../styles/MenuForm.module.scss';
import { MenuDto } from '../dto';
import { compressImage } from '../function/processingImage';
import Loading from './Loading';

interface MenuFormProps {
  slug: string;
  data: MenuDto | null | undefined;
}

interface Values {
  name: string;
  description: string;
  price: number;
}

interface Images {
  file: File | null;
  uploaded: boolean;
  previewUrl: string;
}

interface Errors {
  image?: string;
  name?: string;
  description?: string;
  price?: string;
}

const initialValues: Values = {
  name: '',
  description: '',
  price: 0,
};

const schema = object().shape({
  name: string().required('메뉴 이름을 입력해주세요'),
  description: string().required('메뉴 설명을 입력해주세요'),
  price: number().not([0], '메뉴 가격을 입력해주세요'),
});

export default function MenuForm({ slug, data }: MenuFormProps) {
  const router = useRouter();
  const inputFile = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<Images>({
    file: null,
    uploaded: false,
    previewUrl: '',
  });
  const [ready, setReady] = useState(false);

  const handleSubmit = (
    values: Values,
    { setErrors, setSubmitting }: FormikHelpers<Values>
  ) => {
    setSubmitting(true);

    setSubmitting(false);
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleSubmit,
    validationSchema: schema,
  });

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
  const handleDeleteClick = () => {
    setImage({
      file: null,
      uploaded: false,
      previewUrl: '',
    });
  };

  /**
   * 취소 버튼 눌렀을 때
   */
  const handleCancelClick = () => {
    router.back();
  };

  const setData = (data: MenuDto) => {
    formik.setValues({
      name: data.name,
      description: data.description,
      price: data.price,
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
    <div style={{ width: '100%', height: '100vh' }}>
      <Loading />
    </div>;
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
                  onClick={handleDeleteClick}
                >
                  <IoClose />
                </button>
                <Image
                  src={
                    image.uploaded
                      ? process.env.NEXT_PUBLIC_S3_URL + image.previewUrl
                      : image.previewUrl
                  }
                  alt="menu_image"
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
            isInvalid={!!formik.errors.name}
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
            isInvalid={!!formik.errors.description}
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
              placeholder="메뉴 가격을 입력해주세요"
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.price}
            />
            <InputGroup.Text>원</InputGroup.Text>
            <Form.Control.Feedback type="invalid">
              {formik.errors.price}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        <div className={styles.button_wrapper}>
          <Button
            className={styles.submit_button}
            variant="outline-danger"
            onClick={handleCancelClick}
            type="button"
          >
            취소
          </Button>
          <Button type="submit" className={styles.submit_button}>
            등록하기
          </Button>
        </div>
      </Form>
    </div>
  );
}
