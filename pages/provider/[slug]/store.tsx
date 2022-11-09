import React, {
  ChangeEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import styles from '../../../styles/StoreEdit.module.scss';
import Header from '../../../src/components/Header';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';
import { BeatLoader } from 'react-spinners';
import { requestWithToken } from '../../../src/functions/request';
import Compressor from 'compressorjs';
import { useRouter } from 'next/router';
import axios from 'axios';
import UserContext from '../../../src/contexts/UserProvider';

const credentials = {
  accessKeyId: process.env.NEXT_PUBLIC_ACCESSKEY
    ? process.env.NEXT_PUBLIC_ACCESSKEY
    : '',
  secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESSKEY
    ? process.env.NEXT_PUBLIC_SECRET_ACCESSKEY
    : '',
};

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_REGION,
  credentials: credentials,
});

const bucket = process.env.NEXT_PUBLIC_BUCKET_NAME;

interface IPreviewImage {
  file: null | File;
  previewUrl: string;
}

interface IStoreImage {
  files: File[];
  previewUrls: string[];
}

function EditStore() {
  const router = useRouter();
  const { slug: routerSlug } = router.query;
  const { user, setUser } = useContext(UserContext);
  const [textInputs, setTextInputs] = useState({
    name: '',
    tel: '',
    slug: '',
    wayto: '',
    description: '',
  });
  const { name, tel, slug, wayto, description } = textInputs;

  const [address, setAddress] = useState({
    address: '',
    isAddressFound: false,
    addressDetail: '',
    longitude: 126.7059347817178,
    latitude: 37.4527602629939,
  });
  const addressOpen = useDaumPostcodePopup();
  const [isMapLoad, setIsMapLoad] = useState(false);
  const [geocoder, setGeocoder] = useState<kakao.maps.services.Geocoder>();

  const [previewImage, setPreviewImage] = useState<IPreviewImage>({
    file: null,
    previewUrl: '',
  });
  const previewImageInput = useRef<HTMLInputElement>(null);

  const [storeImage, setStoreImage] = useState<IStoreImage>({
    files: [],
    previewUrls: [],
  });

  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState({
    name: '',
    tel: '',
    slug: '',
    address: '',
  });
  const [isSlugCheckClick, setIsSlugCheckClick] = useState(false);
  // 사용 가능 메시지를 저장할 state
  const [slugSuccess, setSlugSuccess] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newInputs = {
      ...textInputs,
      [e.target.name]: e.target.value,
    };
    setTextInputs(newInputs);
  };

  /**
   * 전화번호에 (-) 붙여주는 함수
   */
  const handleTelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newValue = value
      .replace(/[^0-9]/g, '')
      .replace(
        /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/,
        '$1-$2-$3'
      )
      .replace('--', '-');

    const newInputs = {
      ...textInputs,
      tel: newValue,
    };
    setTextInputs(newInputs);
  };

  /**
   * 주소 팝업창 처리하는 함수
   */
  const handleAddressClick = () => {
    const handleComplete = (data: Address) => {
      // geocoder가 정상적으로 로딩 되었을 때만 처리하기.
      // geocoder가 없으면 좌표를 얻어오지 못해서 안된다!!
      if (geocoder?.addressSearch) {
        geocoder.addressSearch(data.address, (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const latitude = Number.parseFloat(result[0].y);
            const longitude = Number.parseFloat(result[0].x);

            const newAddress = {
              ...address,
              address: data.address,
              isAddressFound: true,
              longitude: longitude,
              latitude: latitude,
            };
            setAddress(newAddress);
          }
        });
      } else {
        alert(
          '지도 라이브러리가 정상적으로 로드되지 않았습니다.\n다시 선택해주시기 바랍니다.'
        );
      }
    };

    addressOpen({ onComplete: handleComplete });
  };

  /**
   * 상세주소 입력을 처리하는 함수
   */
  const handleAddressDetailChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    const newAddress = {
      ...address,
      addressDetail: value,
    };
    setAddress(newAddress);
  };

  /**
   * 슬러그에 유효성을 체크하는 함수
   */
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugCheckClick(false);
    const value = e.target.value;
    const newValue = value.replace(/[^a-zA-Z0-9_]/g, '');
    const newInputs = {
      ...textInputs,
      slug: newValue,
    };
    setTextInputs(newInputs);
  };

  const handleSlugCheck = async () => {
    setIsSlugCheckClick(true);
    // slug를 입력하지 않았을 때
    if (slug === '') {
      setError({
        ...error,
        slug: '홈페이지 주소를 입력해주세요.',
      });
      setSlugSuccess('');
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/provider/check-slug/${slug}`
      );

      const status: number = response.data.status;

      // slug가 사용가능할 때
      if (status === 1400) {
        setError({
          ...error,
          slug: '',
        });
        setSlugSuccess('사용 가능한 홈페이지 주소입니다.');
        return;
      }
      // slug가 중복일 때
      else if (status === 1401) {
        setError({
          ...error,
          slug: '중복된 홈페이지 주소입니다.',
        });
        setSlugSuccess('');
        return;
      }
      // 알 수 없는 응답을 반환했을 때
      else {
        console.error('알 수 없는 상태코드');
        return;
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };

  /**
   * 이미지를 5MB 이하의 크기로 압축하는 함수
   */
  const compressImage = (file: File): Promise<File> => {
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

    const newPreviewImage = {
      file: file,
      previewUrl: URL.createObjectURL(files[0]),
    };
    setPreviewImage(newPreviewImage);
  };

  /**
   * 프로필 사진의 x버튼을 눌렀을 때
   */
  const handlePreviewImageCloseClick = () => {
    setPreviewImage({ file: null, previewUrl: '' });
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

    const files = storeImage.files;
    const previewUrls = storeImage.previewUrls;

    for (let i = 0; i < fileList.length; i++) {
      // 최대 업로드 개수를 초과한 경우 => 반복문 탈출
      if (files.length >= 6) {
        alert('최대 6개까지 업로드 가능합니다.');
        break;
      }

      let file = fileList[i];

      // 이미지 형식이 아닌 경우 => 넘어가고 다음 파일 처리
      if (!(file.type === 'image/jpeg' || file.type === 'image/png')) {
        alert('jpg, png 파일만 업로드 가능합니다.');
        inputFile.value = '';
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

      // 파일 추가
      files.push(file);
      previewUrls.push(URL.createObjectURL(file));
    }

    const newStoreImage = {
      files: files,
      previewUrls: previewUrls,
    };
    setStoreImage(newStoreImage);
  };

  /**
   * 매장 사진의 x버튼을 눌렀을 때
   */
  const handleStoreImageCloseClick = (index: number) => {
    const files = storeImage.files;
    files.splice(index, 1);

    const previewUrls = storeImage.previewUrls;
    previewUrls.splice(index, 1);

    const newStoreImage = {
      files: files,
      previewUrls: previewUrls,
    };
    setStoreImage(newStoreImage);
  };

  const validateForm = async () => {
    let pass = true;
    const newError = { ...error };
    if (textInputs.name === '') {
      newError.name = '매장 이름은 필수항목입니다.';
      pass = false;
    } else {
      newError.name = '';
    }

    if (textInputs.tel === '') {
      newError.tel = '매장 전화번호는 필수항목입니다.';
      pass = false;
    } else {
      newError.tel = '';
    }

    if (!isSlugCheckClick) {
      newError.slug = '홈페이지 주소 중복 체크를 해주세요.';
      setSlugSuccess('');
      pass = false;
    } else if (!slugSuccess) {
      newError.slug = '사용 불가능한 홈페이지 주소입니다.';
      setSlugSuccess('');
      pass = false;
    } else {
      newError.slug = '';
    }

    if (address.address === '') {
      newError.address = '매장 주소는 필수항목입니다.';
      pass = false;
    } else {
      newError.address = '';
    }
    setError(newError);
    return pass;
  };

  /**
   * 프로필 이미지 전송
   */
  const uploadPreviewImage = async () => {
    // 파일 없으면 전송하지 않음
    if (!previewImage.file) return '';

    const fileName = `previewImages/${crypto.randomUUID()}${
      previewImage.file.name
    }`;
    console.log(fileName);

    const command: PutObjectCommandInput = {
      Bucket: bucket,
      Key: fileName,
      Body: previewImage.file,
      ContentType: previewImage.file.type,
      ACL: 'public-read',
    };

    // 파일 전송 (예외 발생 가능)
    await s3Client.send(new PutObjectCommand(command));

    // 성공
    return fileName;
  };

  /**
   * 매장 이미지 전송
   */
  const uploadStoreImage = async () => {
    // 파일 없으면 전송하지 않음
    if (storeImage.files.length === 0) return [];

    const urls: string[] = [];

    for (let i = 0; i < storeImage.files.length; i++) {
      const fileName = `storeImages/${crypto.randomUUID()}${
        storeImage.files[i].name
      }`;
      console.log(fileName);

      const command: PutObjectCommandInput = {
        Bucket: bucket,
        Key: fileName,
        Body: storeImage.files[i],
        ContentType: storeImage.files[i].type,
        ACL: 'public-read',
      };

      // 파일 전송 (예외 발생 가능)
      await s3Client.send(new PutObjectCommand(command));

      // 성공
      urls.push(fileName);
    }

    return urls;
  };

  /**
   * 백엔드에 정보 전송
   */
  const postToApi = async (
    previewImageUrl: string,
    storeImageUrls: string[]
  ) => {
    const data = {
      name: name,
      tel: tel,
      coordinate: {
        longitude: address.longitude,
        latitude: address.latitude,
      },
      address: `${address.address} ${address.addressDetail}`,
      slug: slug,
      wayto: wayto,
      description: description,
      preview_image: previewImageUrl,
      store_image: storeImageUrls,
    };

    const response = await requestWithToken(
      router,
      setUser,
      `/provider/${routerSlug}/store`,
      {
        method: 'post',
        data: data,
      }
    );

    if (response) {
      const status = response.data.status;
      if (status === 2500) {
        alert('성공적으로 적용되었습니다.');
        router.replace(`/provider/${routerSlug}`);
      } else if (status === 2501) {
        alert('필수 정보가 입력되지 않았습니다.');
      } else if (status === 2502) {
        alert('홈페이지 주소가 중복되었습니다.');
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  /**
   * 승인 요청 버튼을 눌렀을 때
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 필수 항목 체크
    if (!(await validateForm())) {
      return;
    }
    setSubmitLoading(true);

    // aws 이미지 업로드
    let previewImageUrl, storeImageUrls;
    try {
      previewImageUrl = await uploadPreviewImage();
      console.log(previewImageUrl);

      storeImageUrls = await uploadStoreImage();
      console.log(storeImageUrls);
    } catch (error) {
      alert('이미지 업로드에 오류가 발생했습니다.\n다시 시도해주세요.');
      setSubmitLoading(false);
      return;
    }

    // 서버에 정보 저장
    try {
      await postToApi(previewImageUrl, storeImageUrls);
    } catch (error) {
      console.error(error);
      alert('서버에 전송하는 도중 오류가 발생했습니다.\n다시 시도해주세요.');
      setSubmitLoading(false);
      return;
    }
  };

  useEffect(() => {
    kakao.maps.load(() => {
      setIsMapLoad(true);
      setGeocoder(new kakao.maps.services.Geocoder());
    });
  }, []);

  return (
    <>
      <Header type={1} />
      <div className={styles.container}>
        <div className={styles.title}>매장 정보 변경</div>
        <Form noValidate onSubmit={handleSubmit}>
          {/* 매장 이름 */}
          <Form.Group className={styles.form_group}>
            <Form.Label>매장 이름 *</Form.Label>
            <Form.Control
              type="text"
              placeholder="매장 이름을 입력해주세요"
              name="name"
              value={name}
              onChange={handleChange}
              isInvalid={!!error.name}
            />
            <Form.Control.Feedback type="invalid">
              {error.name}
            </Form.Control.Feedback>
          </Form.Group>

          {/* 매장 전화번호 */}
          <Form.Group className={styles.form_group}>
            <Form.Label>매장 전화번호 *</Form.Label>
            <Form.Control
              type="tel"
              placeholder="010-0000-0000"
              name="tel"
              value={tel}
              onChange={handleTelChange}
              isInvalid={!!error.tel}
            />
            <Form.Control.Feedback type="invalid">
              {error.tel}
            </Form.Control.Feedback>
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
                value={address.address}
                readOnly
                onClick={handleAddressClick}
                isInvalid={!!error.address}
              />
              <Button onClick={handleAddressClick}>주소 찾기</Button>
              <Form.Control.Feedback type="invalid">
                {error.address}
              </Form.Control.Feedback>
            </InputGroup>
            <Form.Control
              type="text"
              placeholder="상세 주소를 입력해주세요"
              value={address.addressDetail}
              onChange={handleAddressDetailChange}
              disabled={!address.isAddressFound}
              className={styles.address_detail}
            />
            {isMapLoad ? (
              <Map
                center={{ lat: address.latitude, lng: address.longitude }}
                className={styles.map}
              >
                {address.isAddressFound ? (
                  <MapMarker
                    position={{
                      lat: address.latitude,
                      lng: address.longitude,
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
                value={slug}
                onChange={handleSlugChange}
                isValid={!!slugSuccess}
                isInvalid={!!error.slug}
              />
              <Button onClick={handleSlugCheck}>중복 확인</Button>
              {error.slug && !slugSuccess ? (
                <Form.Control.Feedback type="invalid">
                  {error.slug}
                </Form.Control.Feedback>
              ) : (
                <Form.Control.Feedback type="valid">
                  {slugSuccess}
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
              value={wayto}
              onChange={handleChange}
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
              value={description}
              onChange={handleChange}
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
            {previewImage.previewUrl === '' ? null : (
              <div className={styles.image_container}>
                <div className={styles.image_wrapper}>
                  <button
                    className={styles.close_wrapper}
                    onClick={handlePreviewImageCloseClick}
                  >
                    <IoClose />
                  </button>
                  <Image
                    alt="미리보기 이미지"
                    src={previewImage.previewUrl}
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
            {storeImage.previewUrls.length === 0 ? null : (
              <div className={styles.image_container}>
                {storeImage.previewUrls.map((previewUrl, index) => (
                  <div key={index} className={styles.image_wrapper}>
                    <button
                      className={styles.close_wrapper}
                      onClick={() => handleStoreImageCloseClick(index)}
                    >
                      <IoClose />
                    </button>
                    <Image
                      alt="매장 이미지"
                      src={previewUrl}
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
            disabled={submitLoading}
          >
            {submitLoading ? (
              <BeatLoader color="white" size="10px" />
            ) : (
              '승인 요청'
            )}
          </Button>
        </Form>
      </div>
    </>
  );
}

export default EditStore;
