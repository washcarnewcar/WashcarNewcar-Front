import React, { ChangeEvent, useState } from 'react';

import { requestWithToken } from '../../functions/request';

// 스타일 관련(bootstrap, style, header)
import { Button, ButtonGroup, Form, ListGroup } from 'react-bootstrap';
import styles from './Provider.module.scss';
import Header from '../../components/Header';

// 카카오맵
import { Map, MapMarker } from 'react-kakao-maps-sdk';

interface StoreImage {
  url: string;
}

const EditStore = () => {
  const [inputs, setInputs] = useState({
    name: '',
    slug: '',
    address: '',
    addressDetail: '',
    route: '',
    info: '',
  });
  const { name, slug, address, addressDetail, route, info } = inputs;
  const [data, setData] = useState({
    name: '',
    slug: '',
    address: '',
    addressDetail: '',
    route: '',
    info: '',
    profileImage: '',
    storeImage: Array<StoreImage>,
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newInputs = {
      ...inputs,
      [e.target.name]: e.target.value,
    };
    setInputs(newInputs);
    console.log(inputs);
  };

  const onClick = async () => {
    const request = await requestWithToken('/provider/store', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  };

  return (
    <>
      <Header type={1} />
      <div>
        <div className={styles.list_container}>
          <div className={styles.title}>매장 정보 변경</div>
        </div>
        <Form>
          <Form.Group className="mb-3" controlId="formStoreName">
            <Form.Label>매장 이름</Form.Label>
            <Form.Control type="text" placeholder="매장 이름을 입력해주세요" />
          </Form.Group>
        </Form>
        <Form>
          <Form.Group className="mb-3" controlId="formStoreEmail">
            <Form.Label>매장 전화번호</Form.Label>
            <Form.Control
              type="text"
              placeholder="매장 전화번호나 대표 전화번호를 입력해주세요"
            />
            <Form.Label>
              ⦁ 확인을 위해 연락을 취할 수 있으니 정확하게 적어주시기 바랍니다.{' '}
            </Form.Label>
          </Form.Group>
        </Form>

        <Form>
          <Form.Group className="mb-3" controlId="formStoreAddress">
            <Form.Label>매장 주소</Form.Label>
            <Form.Control type="text" placeholder="매장 주소를 입력해주세요 " />
          </Form.Group>
        </Form>
        <div style={{ backgroundColor: 'lavender' }}>
          카카오 맵 들어갈 자리 색은 내 맘임
        </div>
        <Form>
          <Form.Group className="mb-3" controlId="formStoreHomePage">
            <Form.Label>예약 홈페이지 주소 </Form.Label>
            <Form.Control
              type="text"
              placeholder="예약 홈페이지 주소를 입력해주세요 "
            />
          </Form.Group>
        </Form>
        <Form>
          <Form.Group className="mb-3" controlId="formStoreWay">
            <Form.Label>찾아오는 길 (선택) </Form.Label>
            <Form.Control
              type="text"
              placeholder="찾아오는 길 설명을 입력해주세요(선택사항입니다.) "
            />
          </Form.Group>
        </Form>
        <Form>
          <Form.Group className="mb-3" controlId="formStoreDetail">
            <Form.Label>매장 설명(선택) </Form.Label>
            <Form.Control
              type="text"
              placeholder="매장 설명을 입력해주세요(선택 사항입니다)"
            />
          </Form.Group>
        </Form>

        <div>프로필 사진(선택)</div>
        <div>
          <Button variant="secondary">사진 업로드 {'>'}</Button>
        </div>
        <div style={{ backgroundColor: 'lavender' }}>
          프로필 사진 들어갈 자리 역시나 색은 내 맘임
        </div>
        <div>매장 사진(선택)</div>
        <div>
          <Button variant="secondary">사진 업로드 {'>'}</Button>
        </div>
        <div style={{ backgroundColor: 'lavender' }}>
          이미지 사진 들어갈 자리 이것도 색은 내 마음이지
        </div>
        <div className="buttongroup">
          <Button variant="secondary">취소 {'>'}</Button>
          <Button variant="secondary">승인 요청 {'>'}</Button>
        </div>
      </div>
    </>
  );
};

export default EditStore;
