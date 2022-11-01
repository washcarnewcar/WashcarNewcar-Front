import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import styles from '../../../styles/StoreEdit.module.scss';
import Header from '../../../components/header';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { S3Client } from '@aws-sdk/client-s3';
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';
import { IoIosArrowForward } from 'react-icons/io';
import { BeatLoader } from 'react-spinners';

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

interface IProfileImage {
  file: null | File;
  previewUrl: string;
}

interface IStoreImage {
  files: File[];
  previewUrls: string[];
}

function EditStore() {
  const [textInputs, setTextInputs] = useState({
    name: '',
    tel: '',
    slug: '',
    route: '',
    info: '',
  });
  const { name, tel, slug, route, info } = textInputs;

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

  const [profileImage, setProfileImage] = useState<IProfileImage>({
    file: null,
    previewUrl: '',
  });
  const profileImageInput = useRef<HTMLInputElement>(null);

  const [storeImage, setStoreImage] = useState<IStoreImage>({
    files: [],
    previewUrls: [],
  });

  const [submitLoading, setSubmitLoading] = useState(false);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newInputs = {
        ...textInputs,
        [e.target.name]: e.target.value,
      };
      setTextInputs(newInputs);
    },
    [textInputs]
  );

  /**
   * 전화번호에 (-) 붙여주는 함수
   */
  const onTelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    [textInputs]
  );

  /**
   * 주소 팝업창 처리하는 함수
   */
  const onAddressClick = useCallback(() => {
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
  }, [address, geocoder]);

  /**
   * 상세주소 입력을 처리하는 함수
   */
  const onAddressDetailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const newAddress = {
        ...address,
        addressDetail: value,
      };
      setAddress(newAddress);
    },
    [address]
  );

  /**
   * 슬러그에 유효성을 체크하는 함수
   */
  const onSlugChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const newValue = value.replace(/[^a-zA-Z0-9_]/g, '');
      console.log(newValue);

      const newInputs = {
        ...textInputs,
        slug: newValue,
      };
      setTextInputs(newInputs);
    },
    [textInputs]
  );

  /**
   * 프로필 사진이 삽입되었을 때
   */
  const onProfileImageChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const inputFile = e.target;
      const files = e.target.files;

      // 파일을 넣지 않은 경우
      if (!files || files.length < 1) {
        inputFile.value = '';
        return;
      }
      // 파일이 용량을 넘은 경우
      else if (files[0].size > 1024 * 1024 * 5) {
        alert('5MB 이하의 이미지만 업로드 가능합니다.');
        inputFile.value = '';
        return;
      }
      // 이미지 형식이 아닌 경우
      else if (
        !(files[0].type === 'image/jpeg' || files[0].type === 'image/png')
      ) {
        alert('jpg, png 파일만 업로드 가능합니다.');
        inputFile.value = '';
        return;
      }

      const newProfileImage = {
        file: files[0],
        previewUrl: URL.createObjectURL(files[0]),
      };
      setProfileImage(newProfileImage);
    },
    []
  );

  /**
   * 프로필 사진의 x버튼을 눌렀을 때
   */
  const onProfileImageCloseClick = useCallback(() => {
    setProfileImage({ file: null, previewUrl: '' });
    if (profileImageInput.current) {
      profileImageInput.current.value = '';
    }
  }, []);

  /**
   * 매장 사진이 삽입되었을 때
   */
  const onStoreImageChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const inputFile = e.target;
      const fileList = e.target.files;

      // 파일을 넣지 않은 경우
      if (!fileList || fileList.length === 0) {
        inputFile.value = '';
        return;
      }

      for (let i = 0; i < fileList.length; i++) {
        const files = storeImage.files;
        const previewUrls = storeImage.previewUrls;

        // 최대 업로드 개수를 초과한 경우
        if (files.length >= 6) {
          alert('최대 6개까지 업로드 가능합니다.');
          break;
        }

        // 파일이 용량을 넘은 경우
        if (fileList[i].size > 1024 * 1024 * 5) {
          alert('5MB 이하의 이미지만 업로드 가능합니다.');
          inputFile.value = '';
          continue;
        }
        // 이미지 형식이 아닌 경우
        else if (
          !(
            fileList[i].type === 'image/jpeg' ||
            fileList[i].type === 'image/png'
          )
        ) {
          alert('jpg, png 파일만 업로드 가능합니다.');
          inputFile.value = '';
          continue;
        }

        // 파일 추가
        files.push(fileList[i]);
        previewUrls.push(URL.createObjectURL(fileList[i]));

        const newStoreImage = {
          files: files,
          previewUrls: previewUrls,
        };
        setStoreImage(newStoreImage);
      }
    },
    [storeImage]
  );

  /**
   * 매장 사진의 x버튼을 눌렀을 때
   */
  const onStoreImageCloseClick = useCallback(
    (index: number) => {
      console.log(`delete ${index}index`);
      const files = storeImage.files;
      files.splice(index, 1);

      const previewUrls = storeImage.previewUrls;
      previewUrls.splice(index, 1);

      const newStoreImage = {
        files: files,
        previewUrls: previewUrls,
      };
      setStoreImage(newStoreImage);
    },
    [storeImage]
  );

  const onSubmitClick = useCallback(() => {
    setSubmitLoading(!submitLoading);
  }, [textInputs, address, profileImage, storeImage, submitLoading]);

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

        {/* 매장 이름 */}
        <Form.Group className={styles.form_group}>
          <Form.Label>매장 이름 *</Form.Label>
          <Form.Control
            type="text"
            placeholder="매장 이름을 입력해주세요"
            name="name"
            value={name}
            onChange={onChange}
          />
        </Form.Group>

        {/* 매장 전화번호 */}
        <Form.Group className={styles.form_group}>
          <Form.Label>매장 전화번호 *</Form.Label>
          <Form.Control
            type="tel"
            placeholder="010-0000-0000"
            name="tel"
            value={tel}
            onChange={onTelChange}
          />
          <Form.Text>
            확인을 위해 연락을 취할 수 있으니 정확하게 적어주시기 바랍니다.
          </Form.Text>
        </Form.Group>

        {/* 매장 주소 */}
        <Form.Group className={styles.form_group}>
          <Form.Label>매장 주소 *</Form.Label>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="주소 찾기를 눌러주세요"
              value={address.address}
              readOnly
              onClick={onAddressClick}
            />
            <Button onClick={onAddressClick}>주소 찾기</Button>
          </InputGroup>
          <Form.Control
            type="text"
            placeholder="상세 주소를 입력해주세요"
            value={address.addressDetail}
            onChange={onAddressDetailChange}
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
                  position={{ lat: address.latitude, lng: address.longitude }}
                />
              ) : null}
            </Map>
          ) : null}
        </Form.Group>

        {/* 매장 홈페이지 주소 */}
        <Form.Group className={styles.form_group}>
          <Form.Label>매장 홈페이지 주소 *</Form.Label>
          <InputGroup>
            <InputGroup.Text>wcnc.co.kr/</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="사용할 홈페이지 주소"
              value={slug}
              onChange={onSlugChange}
            />
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
            name="route"
            value={route}
            onChange={onChange}
          />
        </Form.Group>

        {/* 매장 설명 */}
        <Form.Group className={styles.form_group}>
          <Form.Label>매장 설명</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="매장 설명을 입력해주세요"
            rows={5}
            name="info"
            value={info}
            onChange={onChange}
          />
        </Form.Group>

        {/* 프로필 사진 */}
        <Form.Group className={styles.form_group}>
          <Form.Label>프로필 사진</Form.Label>
          <Form.Control
            type="file"
            onChange={onProfileImageChange}
            accept="image/png, image/jpeg"
            ref={profileImageInput}
          />
          {/* 프로필 이미지 표시 */}
          {profileImage.previewUrl === '' ? null : (
            <div className={styles.image_container}>
              <div className={styles.image_wrapper}>
                <button
                  className={styles.close_wrapper}
                  onClick={onProfileImageCloseClick}
                >
                  <IoClose />
                </button>
                <Image
                  src={profileImage.previewUrl}
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
            onChange={onStoreImageChange}
          />
          {/* 프로필 이미지 표시 */}
          {storeImage.previewUrls.length === 0 ? null : (
            <div className={styles.image_container}>
              {storeImage.previewUrls.map((previewUrl, index) => (
                <div key={index} className={styles.image_wrapper}>
                  <button
                    className={styles.close_wrapper}
                    onClick={() => onStoreImageCloseClick(index)}
                  >
                    <IoClose />
                  </button>
                  <Image
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

        <Button className={styles.submit_button} onClick={onSubmitClick}>
          {submitLoading ? (
            <BeatLoader color="white" size="10px" />
          ) : (
            '승인 요청'
          )}
        </Button>
      </div>
    </>
  );
}

export default EditStore;

/*
const config = {
  bucketName: process.env.NEXT_PUBLIC_BUCKET_NAME,
  dirName: process.env.NEXT_PUBLIC_DIR_NAME,
  region: process.env.NEXT_PUBLIC_REGION,
  accessKeyId: process.env.NEXT_PUBLIC_ACCESSKEY,
  secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESSKEY,
};

const uploadImage = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
  const inputFile = e.target;
  const files = e.target.files;

  // 예외처리
  // 파일을 넣지 않은 경우
  if (!files || files.length < 1) {
    inputFile.value = '';
    return;
  }
  // 파일이 용량을 넘은 경우
  else if (files[0].size > 1024 * 1024 * 5) {
    alert('5MB 이하의 이미지만 업로드 가능합니다.');
    inputFile.value = '';
    return;
  }
  // 이미지 형식이 아닌 경우
  else if (!(files[0].type === 'image/jpeg' || files[0].type === 'image/png')) {
    alert('jpg, png 파일만 업로드 가능합니다.');
    inputFile.value = '';
    return;
  }

  const fileName = `profileImages/${crypto.randomUUID()}${files[0].name}`;
  console.log(fileName);

  const command: PutObjectCommandInput = {
    Bucket: bucket,
    Key: fileName,
    Body: files[0],
    ContentType: files[0].type,
    ACL: 'public-read',
  };

  try {
    const results = await s3Client.send(new PutObjectCommand(command));
    console.log(results);
  } catch (err) {
    console.error(err);
    inputFile.value = '';
  }
}, []);

const onClick = async () => {
  const request = await requestWithToken('/provider/store', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(textInputs),
  });
};

const onTestClick = useCallback(() => {
  console.log(crypto.randomUUID() + new Date().getTime().toString());
}, []);

useEffect(() => {}, []);
*/
