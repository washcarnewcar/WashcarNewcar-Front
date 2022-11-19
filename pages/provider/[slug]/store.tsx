import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '../../../src/components/Header';
import LoginCheck from '../../../src/components/LoginCheck';
import StoreForm from '../../../src/components/StoreForm';
import { StoreDto } from '../../../src/dto';
import { authClient, client } from '../../../src/function/request';

const mockData: StoreDto = {
  name: '스타일카케어',
  tel: '010-2474-6837',
  coordinate: {
    longitude: 126.70659347817178,
    latitude: 37.4527602629939,
  },
  address: '서울 서초구 반포대로 24길 20',
  address_detail: '1층',
  slug: 'stylecarcare',
  wayto: '서초역 1번 출구에서 바로 우회전 후 현대 자동차 정비소 끼고...',
  description: '안녕하세요 스타일 카케어 서초직영점입니다. ...',
  preview_image:
    'previewImages/0b0dbb8d-a91a-417d-987e-f1ee879dc98d%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA+2022-10-31+%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE+7.42.45.png',
  store_image: [
    'storeImages/139d3ddd-6596-4316-aee5-c3e3cbbba23e3D_map3.png',
    'storeImages/059eb9dd-e6f9-4507-91a3-ec1825a6d64b%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA+2022-11-10+%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE+5.07.00.png',
    'storeImages/13581fcb-d446-434e-8241-1ef0dd142faf3D_map8_back.jpeg',
  ],
};

export default function EditStore() {
  const router = useRouter();
  const { slug } = router.query;
  const [data, setData] = useState<StoreDto>();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await authClient.get(`/provider/${slug}/store`);
        // const data: StoreDto | undefined = response.data;
        const data: StoreDto | undefined = mockData;
        // TODO:
        console.log(data);
        if (data) {
          setData(data);
        } else {
          throw Error('data 전송되지 않음');
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (slug) {
      getData();
    }
  }, [slug]);

  return (
    <LoginCheck>
      <StoreForm data={data} />
    </LoginCheck>
  );
}
