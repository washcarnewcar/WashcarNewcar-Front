import React, { ChangeEvent, useState } from 'react';
import { Button } from 'react-bootstrap';
import { requestWithToken } from '../functions/request';

interface StoreImage {
  url: string;
}

const Store = () => {
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
    <div>
      매장 생성 / 수정 페이지입니다.
      <div>매장이름</div>
      <div>
        <input
          type="text"
          onChange={onChange}
          value={name}
          name="name"
          placeholder="매장의 이름을 입력해주세요"
        />
      </div>
      <div>홈페이지 주소</div>
      <div>
        http://washcarnewcar.duckdns.org/
        <input type="text" onChange={onChange} value={slug} name="slug" />
      </div>
      <div>매장 주소</div>
      <input type="text" onChange={onChange} value={address} name="address" />
      <div style={{ backgroundColor: 'tomato' }}>카카오맵 영역</div>
      <div>매장 상세 주소</div>
      <input
        type="text"
        onChange={onChange}
        value={addressDetail}
        name="addressDetail"
      />
      <div>찾아오는 길(선택)</div>
      <div>
        <textarea
          cols={30}
          rows={5}
          onChange={onChange}
          value={route}
          name="route"
        />
      </div>
      <div>매장 설명(선택)</div>
      <div>
        <textarea
          id=""
          cols={30}
          rows={5}
          onChange={onChange}
          value={info}
          name="info"
        />
      </div>
      <div>프로필 사진(선택)</div>
      <div>
        <button>사진 업로드 {'>'}</button>
      </div>
      <div>매장 사진(선택)</div>
      <div>
        <button>사진 업로드 {'>'}</button>
      </div>
      <button onClick={onClick}>저장</button>
    </div>
  );
};

export default Store;
