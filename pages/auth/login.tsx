import axios, { AxiosError } from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import styles from '../../styles/Login.module.scss';

interface IForm {
  id: string;
  password: string;
}

interface IFormValidate {
  id: string;
  password: string;
}

function Login() {
  const router = useRouter();
  const [inputs, setInputs] = useState<IForm>({
    id: '',
    password: '',
  });
  const [isSubmitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<IFormValidate>({
    id: '',
    password: '',
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const name = e.target.name;
      const newInputs = {
        ...inputs,
        [name]: e.target.value,
      };
      setInputs(newInputs);
    },
    [inputs]
  );

  const validate = useCallback(() => {
    let validated = true;
    const newErrors: IFormValidate = {
      id: '',
      password: '',
    };

    if (!inputs.id) {
      newErrors.id = '아이디를 입력해주세요';
      validated = false;
    }

    if (!inputs.password) {
      newErrors.password = '비밀번호를 입력해주세요';
      validated = false;
    }

    setErrors(newErrors);
    return validated;
  }, [inputs]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // 검증
      if (!validate()) return;

      setSubmitting(true);

      // form data 생성
      const form = new FormData();
      form.append('id', inputs.id);
      form.append('password', inputs.password);

      // 로그인 요청
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/login`,
          form
        );

        // 토큰 저장
        const token = response.data.access_token;
        const refToken = response.data.refresh_token;
        localStorage.setItem('token', token);
        localStorage.setItem('refresh_token', refToken);

        // 홈화면으로
        router.replace('/');
      } catch (error) {
        // 사용자 정보가 없을 시
        if (error instanceof AxiosError && error.request.status === 401) {
          const newErrors = {
            id: ' ',
            password: '아이디 또는 비밀번호가 틀렸습니다.',
          };
          setErrors(newErrors);
        } else {
          alert('알 수 없는 오류가 발생했습니다.');
          console.error(error);
        }
      }
    },
    [inputs, validate, router]
  );

  return (
    <>
      <div className={styles.container}>
        <Link href="/">
          <a className={styles.logo_container}>
            <Image
              src="/row_logo.png"
              alt="세차새차"
              height={54}
              width={200}
              className={styles.img_logo}
            />
          </a>
        </Link>

        <div className={styles.form_container}>
          <div className={styles.title}>로그인</div>
          <Form className={styles.form} onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Control
                type="text"
                className={styles.id}
                placeholder="아이디"
                name="id"
                value={inputs.id}
                onChange={handleChange}
                isInvalid={!!errors.id}
              />
              <Form.Control.Feedback type="invalid">
                {errors.id}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Control
                type="password"
                className={styles.pw}
                placeholder="비밀번호"
                name="password"
                value={inputs.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className={styles.login_button}
              disabled={isSubmitting}
            >
              {isSubmitting ? <BeatLoader color="white" size={10} /> : '로그인'}
            </Button>
            <a
              href={process.env.NEXT_PUBLIC_API + '/oauth2/authorization/kakao'}
            >
              <Image
                src="/kakao_login_large_wide.png"
                alt="카카오 로그인"
                height={45}
                width={300}
                className={styles.kakao_login}
              />
            </a>

            <div className={styles.signup}>
              <div>아직 계정이 없으신가요?</div>
              <Link href="/auth/signup">
                <a className={styles.signup_button}>회원가입</a>
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}

export default Login;
