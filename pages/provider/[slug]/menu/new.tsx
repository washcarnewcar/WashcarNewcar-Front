import Compressor from 'compressorjs';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Form,
  InputGroup,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
import { IoAdd, IoClose, IoImage } from 'react-icons/io5';
import { number } from 'yup';
import Header from '../../../../components/header';
import styles from '../../../../styles/MenuNew.module.scss';

interface Inputs {
  image: File | null;
  imageUrl: string;
  name: string;
  detail: string;
  price: string;
}

interface Errors {
  image: string;
  name: string;
  detail: string;
  price: string;
}

export default function MenuNew() {
  const router = useRouter();
  const { slug } = router.query;

  const [inputs, setInputs] = useState<Inputs>({
    image: null,
    imageUrl: '',
    name: '',
    detail: '',
    price: '',
  });

  const [error, setError] = useState<Errors>({
    image: '',
    name: '',
    detail: '',
    price: '',
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newInputs = {
        ...inputs,
        [e.target.name]: e.target.value,
      };
      setInputs(newInputs);
    },
    [inputs]
  );

  /**
   * 이미지를 5MB 이하의 크기로 압축하는 함수
   */
  const compressImage = useCallback((file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      if (!file) reject('파일이 없음');

      new Compressor(file, {
        convertSize: 5000000,
        success(file: File) {
          resolve(file);
        },
        error(error) {
          reject('압축 도중 오류 발생');
        },
      });
    });
  }, []);

  /**
   * 이미지를 선택했을 때
   */
  const handleImageInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      let file = e.target.files ? e.target.files[0] : null;

      // 파일을 넣지 않은 경우
      if (!file) {
        const newInputs = {
          ...inputs,
          image: null,
          imageUrl: '',
        };
        setInputs(newInputs);
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

      const newInputs = {
        ...inputs,
        image: file,
        imageUrl: URL.createObjectURL(file),
      };
      setInputs(newInputs);
    },
    [inputs, compressImage]
  );

  /**
   * 등록하기를 눌렀을 때
   */
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log(inputs);
    },
    [inputs]
  );

  return (
    <>
      <Header type={1} />
      <div className={styles.container}>
        <Form onSubmit={handleSubmit}>
          <div className={styles.image_container}>
            <div className={styles.image_wrapper}>
              {inputs.imageUrl ? (
                <>
                  <label htmlFor="file" className={styles.change_wrapper}>
                    <IoImage size="100%" />
                  </label>
                  <Image
                    src={inputs.imageUrl}
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
                onChange={handleImageInput}
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
              value={inputs.name}
              onChange={handleChange}
              isInvalid={!!error.name}
            />
            <Form.Control.Feedback type="invalid">
              {error.name}
            </Form.Control.Feedback>
          </Form.Group>

          {/* 메뉴 설명 */}
          <Form.Group className={styles.form_group}>
            <Form.Label>메뉴 설명</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="메뉴의 설명을 입력해주세요"
              name="detail"
              value={inputs.detail}
              onChange={handleChange}
              isInvalid={!!error.detail}
            />
            <Form.Control.Feedback type="invalid">
              {error.name}
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
                value={inputs.price}
                onChange={handleChange}
                isInvalid={!!error.price}
              />
              <InputGroup.Text>원</InputGroup.Text>
              <Form.Control.Feedback type="invalid">
                {error.price}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Button type="submit" className={styles.submit_button}>
            등록하기
          </Button>
        </Form>
      </div>
    </>
  );
}
