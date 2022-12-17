import { FormikHelpers, useFormik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';
import { IoClose } from 'react-icons/io5';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { BeatLoader } from 'react-spinners';
import styles from '../../styles/StoreForm.module.scss';
import { StoreDto } from '../dto';
import { compressImage } from '../function/processingImage';
import { authClient } from '../function/request';
import { Images, uploadImage, uploadImages } from '../function/S3Utils';
import Loading from './Loading';

interface Values {
  name: string;
  tel1: string;
  tel2: string;
  tel3: string;
  address: string;
  addressDetail: string;
  longitude: number;
  latitude: number;
  slug: string;
  wayto: string;
  description: string;
}

interface Errors {
  name?: string;
  tel1?: string;
  tel2?: string;
  tel3?: string;
  address?: string;
  slug?: string;
}

const initialValues: Values = {
  name: '',
  tel1: '',
  tel2: '',
  tel3: '',
  address: '',
  addressDetail: '',
  longitude: 126.7059347817178,
  latitude: 37.4527602629939,
  slug: '',
  wayto: '',
  description: '',
};

interface StoreFormProps {
  data: StoreDto | null | undefined;
}

export default function StoreForm({ data }: StoreFormProps) {
  const router = useRouter();
  const addressOpen = useDaumPostcodePopup();

  // slug 사용 가능 메시지
  const [slugValid, setSlugValid] = useState('');

  // 카카오맵 로딩되었는지 확인
  const [isMapLoad, setIsMapLoad] = useState(false);

  // 이미지
  const [previewImage, setPreviewImage] = useState<Images>({
    file: null,
    uploaded: false,
    previewUrl: '',
  });
  const [storeImages, setStoreImages] = useState<Images[]>([]);
  const previewImageInput = useRef<HTMLInputElement>(null);

  const [ready, setReady] = useState(false);

  /**
   * 주소 팝업창 처리하는 함수
   */
  const handleAddressClick = () => {
    const handleComplete = (data: Address) => {
      // geocoder가 정상적으로 로딩 되었을 때만 처리하기.
      // geocoder가 없으면 좌표를 얻어오지 못해서 안된다!!
      kakao.maps.load(() => {
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch(data.address, (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const latitude = Number.parseFloat(result[0].y);
            const longitude = Number.parseFloat(result[0].x);

            formik.setValues((values) => ({
              ...values,
              address: data.address,
              longitude: longitude,
              latitude: latitude,
            }));
          }
        });
      });
    };

    addressOpen({ onComplete: handleComplete });
  };

  /**
   * 중복 확인 버튼을 클릭했을 때
   */
  const handleSlugCheck = async () => {
    formik.setTouched(
      {
        ...formik.touched,
        slug: true,
      },
      false
    );

    if (!formik.values.slug) {
      formik.setErrors({
        ...formik.errors,
        slug: '홈페이지 주소는 필수항목입니다.',
      });
      setSlugValid('');
      return;
    } else if (!formik.values.slug.match(/^[a-zA-Z0-9_]*$/g)) {
      formik.setErrors({
        ...formik.errors,
        slug: '홈페이지 주소 형식에 맞지 않습니다.',
      });
      setSlugValid('');
      return;
    } else if (formik.values.slug === 'new') {
      formik.setErrors({
        ...formik.errors,
        slug: '사용할 수 없는 홈페이지 주소입니다.',
      });
      setSlugValid('');
      return;
    }

    try {
      const response = await authClient.get(
        `/provider/check-slug/${formik.values.slug}`
      );
      console.debug(`GET /provider/check-slug/${formik.values.slug}`);

      console.debug(response?.data);
      const status: number = response.data.status;
      switch (status) {
        case 1400:
          formik.setErrors({
            ...formik.errors,
            slug: '',
          });
          setSlugValid('사용 가능한 홈페이지 주소입니다.');
          return;
        case 1401:
          formik.setErrors({
            ...formik.errors,
            slug: '중복된 홈페이지 주소입니다.',
          });
          setSlugValid('');
          return;
        default:
          throw Error('알 수 없는 상태코드');
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setValues((values) => ({ ...values, slug: e.target.value }));
    setSlugValid('');
  };

  /**
   * 프로필 사진이 삽입되었을 때
   */
  const handlePreviewImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputFile = e.target;
    const files = e.target.files;

    // 파일을 넣지 않은 경우
    if (!files || files.length < 1) {
      inputFile.value = '';
      return;
    }

    let file = files[0];

    // 이미지 형식이 아닌 경우
    if (!(file.type === 'image/jpeg' || file.type === 'image/png')) {
      alert('jpg, png 파일만 업로드 가능합니다.');
      inputFile.value = '';
      return;
    }

    // 파일이 5MB를 넘은 경우 => 압축
    if (file.size > 1024 * 1024 * 5) {
      try {
        file = await compressImage(file);
      } catch (error) {
        alert('압축 과정에서 오류가 발생했습니다.');
        inputFile.value = '';
        return;
      }
    }

    setPreviewImage({
      ...previewImage,
      file: file,
      previewUrl: URL.createObjectURL(files[0]),
    });
  };

  /**
   * 프로필 사진의 x버튼을 눌렀을 때
   */
  const handlePreviewImageCloseClick = () => {
    setPreviewImage({ file: null, uploaded: false, previewUrl: '' });
    if (previewImageInput.current) {
      previewImageInput.current.value = '';
    }
  };

  /**
   * 매장 사진이 삽입되었을 때
   */
  const handleStoreImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputFile = e.target;
    const fileList = e.target.files;

    // 파일을 넣지 않은 경우
    if (!fileList || fileList.length === 0) {
      inputFile.value = '';
      return;
    }

    const newStoreImages = [...storeImages];

    for (let i = 0; i < fileList.length; i++) {
      // 최대 업로드 개수를 초과한 경우 => 반복문 탈출
      if (newStoreImages.length >= 6) {
        alert('최대 6개까지 업로드 가능합니다.');
        break;
      }

      let file = fileList[i];

      // 이미지 형식이 아닌 경우 => 넘어가고 다음 파일 처리
      if (!(file.type === 'image/jpeg' || file.type === 'image/png')) {
        alert('jpg, png 파일만 업로드 가능합니다.');
        continue;
      }

      // 파일이 5MB를 넘은 경우 => 압축
      if (file.size > 1024 * 1024 * 5) {
        try {
          file = await compressImage(file);
        } catch (error) {
          alert('압축 과정에서 오류가 발생했습니다.');
          inputFile.value = '';
          continue;
        }
      }

      newStoreImages.push({
        file: file,
        uploaded: false,
        previewUrl: URL.createObjectURL(file),
      });
      setStoreImages(newStoreImages);
    }
  };

  /**
   * 세차장 사진의 x버튼을 눌렀을 때
   */
  const handleStoreImageCloseClick = (index: number) => {
    const newStoreImages = [...storeImages];
    newStoreImages.splice(index, 1);
    setStoreImages(newStoreImages);
  };

  /**
   * 백엔드에 정보 전송
   */
  const postToApi = async (
    values: Values,
    previewImageUrl: string,
    storeImageUrls: string[]
  ) => {
    const storeDto: StoreDto = {
      name: values.name,
      tel: `${values.tel1}-${values.tel2}-${values.tel3}`,
      coordinate: {
        longitude: values.longitude,
        latitude: values.latitude,
      },
      address: values.address,
      address_detail: values.addressDetail,
      slug: values.slug,
      wayto: values.wayto,
      description: values.description,
      preview_image: previewImageUrl,
      store_image: storeImageUrls,
    };

    // provider/:slug 일때
    if (data) {
      const response = await authClient.post(
        `/provider/${data.slug}/store`,
        storeDto
      );
      console.debug(`POST /provider/${data.slug}/store`, storeDto);
      console.debug(response.data);

      if (response) {
        switch (response.data.status) {
          case 2500:
            alert('수정되었습니다.');
            router.replace(`/provider/${formik.values.slug}`);
            return;
          case 2501:
            alert('필수 정보가 입력되지 않았습니다.');
            formik.setSubmitting(false);
            return;
          case 2502:
            alert('홈페이지 주소가 중복되었습니다.');
            formik.setSubmitting(false);
            return;
          default:
            formik.setSubmitting(false);
            throw Error('알 수 없는 상태코드 수신');
        }
      }
    }
    // provider/new 일때
    else if (data === null) {
      const response = await authClient.post(`/provider/new`, storeDto);
      console.debug(`POST /provider/new`, storeDto);
      console.debug(response.data);

      if (response) {
        switch (response.data.status) {
          case 1300:
            alert('성공적으로 요청되었습니다.');
            router.replace(`/provider/${formik.values.slug}`);
            return;
          case 1301:
            alert('필수 정보가 입력되지 않았습니다.');
            formik.setSubmitting(false);
            return;
          case 1302:
            alert('홈페이지 주소가 중복되었습니다.');
            formik.setSubmitting(false);
            return;
          default:
            formik.setSubmitting(false);
            throw Error('알 수 없는 상태코드 수신');
        }
      }
    }
  };

  /**
   * 승인 요청 버튼을 눌렀을 때
   */
  const handleSubmit = async (
    values: Values,
    { setSubmitting, setErrors }: FormikHelpers<Values>
  ) => {
    // slug 유효한지 확인
    if (!slugValid) {
      setErrors({
        ...formik.errors,
        slug: '중복 확인을 해주세요.',
      });
      setSlugValid('');
      return;
    }

    setSubmitting(true);

    // aws 이미지 업로드
    let previewImageUrl, storeImageUrls;
    try {
      previewImageUrl = await uploadImage(previewImage, 'previewImages');
      storeImageUrls = await uploadImages(storeImages, 'storeImages');
    } catch (error) {
      alert('이미지 업로드에 오류가 발생했습니다.\n다시 시도해주세요.');
      setSubmitting(false);
      return;
    }

    // 서버에 정보 저장
    try {
      await postToApi(values, previewImageUrl, storeImageUrls);
    } catch (error) {
      console.error(error);
      alert('서버에 전송하는 도중 오류가 발생했습니다.\n다시 시도해주세요.');
      setSubmitting(false);
      return;
    }
  };

  const validate = (values: Values) => {
    const newErrors: Errors = {};

    if (!values.name) {
      newErrors.name = '세차장 이름은 필수항목입니다.';
    }

    if (!values.tel1 || !/^[0-9]*$/.test(values.tel1)) {
      newErrors.tel1 = ' ';
    }

    if (!values.tel2 || !/^[0-9]*$/.test(values.tel2)) {
      newErrors.tel2 = ' ';
    }

    if (!values.tel3 || !/^[0-9]*$/.test(values.tel3)) {
      newErrors.tel3 = ' ';
    }

    if (!values.address) {
      newErrors.address = '세차장 주소는 필수항목입니다.';
    }

    if (!slugValid) {
      setSlugValid('');
      newErrors.slug = '중복 확인을 해주세요.';
    }

    return newErrors;
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleSubmit,
    validate: validate,
  });

  const setData = (data: StoreDto) => {
    const tel = data.tel.split('-');
    formik.setValues({
      address: data.address,
      addressDetail: data.address_detail,
      description: data.description,
      name: data.name,
      slug: data.slug,
      tel1: tel[0],
      tel2: tel[1],
      tel3: tel[2],
      wayto: data.wayto,
      latitude: data.coordinate.latitude,
      longitude: data.coordinate.longitude,
    });
    // string => Image
    setPreviewImage({
      file: null,
      uploaded: true,
      previewUrl: data.preview_image,
    });
    // string[] => Image[]
    setStoreImages(
      data.store_image.map((storeImage) => ({
        file: null,
        uploaded: true,
        previewUrl: storeImage,
      }))
    );
    setSlugValid('사용 가능한 홈페이지 주소입니다.');
  };

  useEffect(() => {
    kakao.maps.load(() => {
      setIsMapLoad(true);
    });
  }, []);

  useEffect(() => {
    if (data === null) {
      setReady(true);
    } else if (data) {
      setData(data);
      setReady(true);
    }
  }, [data]);

  if (!ready) {
    return (
      <div style={{ width: '100%', height: '100vh' }}>
        <Loading />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>매장 정보 변경</div>
      <Form noValidate onSubmit={formik.handleSubmit}>
        {/* 매장 이름 */}
        <Form.Group className={styles.form_group}>
          <Form.Label>매장 이름 *</Form.Label>
          <Form.Control
            type="text"
            placeholder="매장 이름을 입력해주세요"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.name && formik.touched.name}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.name}
          </Form.Control.Feedback>
        </Form.Group>

        {/* 매장 전화번호 */}
        <Form.Group className={styles.form_group}>
          <Form.Label>매장 전화번호 *</Form.Label>
          <div className={styles.tel_container}>
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
          <Form.Text>
            확인을 위해 연락을 취할 수 있으니 정확하게 적어주시기 바랍니다.
          </Form.Text>
        </Form.Group>

        {/* 매장 주소 */}
        <Form.Group className={styles.form_group}>
          <Form.Label>매장 주소 *</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type="text"
              placeholder="주소 찾기를 눌러주세요"
              value={formik.values.address}
              readOnly
              onClick={handleAddressClick}
              isInvalid={!!formik.errors.address && formik.touched.address}
            />
            <Button onClick={handleAddressClick}>주소 찾기</Button>
            <Form.Control.Feedback type="invalid">
              {formik.errors.address}
            </Form.Control.Feedback>
          </InputGroup>
          <Form.Control
            type="text"
            placeholder="상세 주소를 입력해주세요"
            name="addressDetail"
            value={formik.values.addressDetail}
            onChange={formik.handleChange}
            disabled={!formik.values.address}
            className={styles.address_detail}
          />
          {isMapLoad ? (
            <Map
              center={{
                lat: formik.values.latitude,
                lng: formik.values.longitude,
              }}
              className={styles.map}
            >
              {formik.values.address ? (
                <MapMarker
                  position={{
                    lat: formik.values.latitude,
                    lng: formik.values.longitude,
                  }}
                />
              ) : null}
            </Map>
          ) : null}
        </Form.Group>

        {/* 매장 홈페이지 주소 */}
        <Form.Group className={styles.form_group}>
          <Form.Label>매장 홈페이지 주소 *</Form.Label>
          <InputGroup hasValidation>
            <InputGroup.Text>wcnc.co.kr/</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="example"
              value={formik.values.slug}
              onChange={handleSlugChange}
              isValid={!!slugValid}
              isInvalid={!!formik.errors.slug && formik.touched.slug}
            />
            <Button onClick={handleSlugCheck} type="button">
              중복 확인
            </Button>
            {formik.errors.slug ? (
              <Form.Control.Feedback type="invalid">
                {formik.errors.slug}
              </Form.Control.Feedback>
            ) : (
              <Form.Control.Feedback type="valid">
                {slugValid}
              </Form.Control.Feedback>
            )}
          </InputGroup>
          <Form.Text>
            영문 대소문자와 숫자, 언더바(_)만 입력 가능합니다.
          </Form.Text>
        </Form.Group>

        {/* 찾아오는 길 */}
        <Form.Group className={styles.form_group}>
          <Form.Label>찾아오는 길</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="찾아오는 길을 입력해주세요"
            rows={5}
            name="wayto"
            value={formik.values.wayto}
            onChange={formik.handleChange}
          />
        </Form.Group>

        {/* 매장 설명 */}
        <Form.Group className={styles.form_group}>
          <Form.Label>매장 설명</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="매장 설명을 입력해주세요"
            rows={5}
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
          />
        </Form.Group>

        {/* 미리보기 사진 */}
        <Form.Group className={styles.form_group}>
          <Form.Label>프로필 사진</Form.Label>
          <Form.Control
            type="file"
            onChange={handlePreviewImageChange}
            accept="image/png, image/jpeg"
            ref={previewImageInput}
          />
          {/* 미리보기 사진 표시 */}
          {!previewImage.previewUrl ? null : (
            <div className={styles.image_container}>
              <div className={styles.image_wrapper}>
                <button
                  type="button"
                  className={styles.close_wrapper}
                  onClick={handlePreviewImageCloseClick}
                >
                  <IoClose />
                </button>
                <Image
                  alt="미리보기 이미지"
                  src={
                    previewImage.uploaded
                      ? `${process.env.NEXT_PUBLIC_S3_URL}${previewImage.previewUrl}`
                      : previewImage.previewUrl
                  }
                  width={100}
                  height={100}
                  className={styles.image}
                />
              </div>
            </div>
          )}
        </Form.Group>

        {/* 매장 사진 */}
        <Form.Group className={styles.form_group}>
          <Form.Label>매장 사진</Form.Label>
          <Form.Control
            type="file"
            multiple
            accept="image/png, image/jpeg"
            onChange={handleStoreImageChange}
          />
          {/* 매장 사진 표시 */}
          {storeImages.length === 0 ? null : (
            <div className={styles.image_container}>
              {storeImages.map((storeImage, index) => (
                <div key={index} className={styles.image_wrapper}>
                  <button
                    type="button"
                    className={styles.close_wrapper}
                    onClick={() => handleStoreImageCloseClick(index)}
                  >
                    <IoClose />
                  </button>
                  <Image
                    alt="매장 이미지"
                    src={
                      storeImage.uploaded
                        ? `${process.env.NEXT_PUBLIC_S3_URL}${storeImage.previewUrl}`
                        : storeImage.previewUrl
                    }
                    width={100}
                    height={100}
                    className={styles.image}
                  />
                </div>
              ))}
            </div>
          )}
        </Form.Group>

        <Button
          type="submit"
          className={styles.submit_button}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? (
            <BeatLoader color="white" size="10px" />
          ) : data ? (
            '정보 수정'
          ) : (
            '승인 요청'
          )}
        </Button>
      </Form>
    </div>
  );
}
