import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { IoIosArrowForward } from 'react-icons/io';
import { BeatLoader } from 'react-spinners';
import Header from '../../src/components/Header';

export default function Search() {
  const router = useRouter();
  const { longitude, latitude } = router.query;
  const [coordinate, setCoordinate] = useState({
    // 길튼교회 좌표
    latitude: 37.4527602629939,
    longitude: 126.7059347817178,
  });
  const [textLocation, setTextLocation] = useState('');
  const [foundLocation, setFoundLocation] = useState(false);

  /**
   * 좌표를 주소로 변환하여 텍스트로 표시하는 함수
   */
  const displayLocation = (geocoder: kakao.maps.services.Geocoder, longitude: number, latitude: number) => {
    geocoder.coord2Address(
      longitude,
      latitude,
      (
        result: {
          address: kakao.maps.services.Address;
          road_address: kakao.maps.services.RoadAaddress | null;
        }[],
        status: kakao.maps.services.Status
      ) => {
        if (status === kakao.maps.services.Status.OK) {
          const address = result[0].address;
          setTextLocation(`${address.region_1depth_name} ${address.region_2depth_name} ${address.region_3depth_name}`);
        }
        setFoundLocation(true);
      }
    );
  };

  /**
   * geolocation을 사용해 위치를 받아오는데 성공하면 호출되는 함수
   */
  const positionCallback = (position: GeolocationPosition) => {
    const longitude = position.coords.longitude;
    const latitude = position.coords.latitude;
    setCoordinate({ longitude: longitude, latitude: latitude });
    kakao.maps.load(() => {
      const geocoder = new kakao.maps.services.Geocoder();
      displayLocation(geocoder, longitude, latitude);
    });
  };

  /**
   * geolocation을 사용해 위치를 받아오는데 실패하면 호출되는 함수
   */
  const positionErrorCallback = (error: GeolocationPositionError) => {
    if (error.code === GeolocationPositionError.PERMISSION_DENIED) {
      console.debug('권한 없음');
    } else if (error.code === GeolocationPositionError.POSITION_UNAVAILABLE) {
      console.debug('위치를 사용할 수 없음');
    }
  };

  useEffect(() => {
    if (!router.isReady) return;

    /**
     * url에 longitude와 latitude가 없을 시 gps를 통해 위치를 가져온다.
     */
    if (!longitude || !latitude) {
      navigator.geolocation.getCurrentPosition(positionCallback, positionErrorCallback);
    } else {
      console.debug('위치 찾음');

      const parsedLongitude = parseFloat(longitude as string);
      const parsedLatitude = parseFloat(latitude as string);
      setCoordinate({ latitude: parsedLatitude, longitude: parsedLongitude });

      kakao.maps.load(() => {
        const geocoder = new kakao.maps.services.Geocoder();
        displayLocation(geocoder, parsedLongitude, parsedLatitude);
      });
    }
  }, [router.isReady]);

  return (
    <>
      <Head>
        <title>세차새차 - 세차장 검색</title>
      </Head>
      <Header />
      <Container>
        <Link
          href={{
            pathname: '/search/map',
            query: {
              longitude: coordinate.longitude,
              latitude: coordinate.latitude,
              foundLocation: foundLocation,
            },
          }}
          className="d-flex justify-content-between align-items-center text-decoration-none p-3 text-black rounded shadow m-3 mb-4 btn btn-light"
        >
          <div className="fs-5 fw-bold">검색 위치</div>
          <div className="d-flex align-items-center">
            <div className="me-2">{foundLocation ? textLocation : <BeatLoader size={10} />}</div>
            <IoIosArrowForward size={20} />
          </div>
        </Link>

        <Item slug="stylecarcare" />
        <Item slug="test" />
        <Item slug="test" />
        <Item slug="test" />
        <Item slug="test" />
      </Container>
    </>
  );
}

interface ItemProps {
  slug: string;
}

function Item({ slug }: ItemProps) {
  return (
    <Link
      href={`/store/${slug}`}
      className="d-block text-decoration-none text-black rounded shadow m-3 shadow btn btn-light text-start p-3"
    >
      <div className="d-flex">
        <Image
          src="/style_carcare.jpg"
          alt="스타일카케어"
          width={60}
          height={60}
          style={{ objectFit: 'cover' }}
          className="rounded"
        />
        <div className="ps-3">
          <div className="fs-4 fw-bold">스타일카케어</div>
          <div className="d-flex align-items-center">
            <div className="me-3">0.3km</div>
            <div>
              ⭐️ <strong>4.7</strong> (200+)
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-scroll d-flex pt-3" style={{ gap: '5px' }}>
        <Tag text="기본세차 38,500원" />
        <Tag text="스페셜세차 66,000원" />
        <Tag text="프리미엄세차 126,000원" />
      </div>
    </Link>
  );
}

interface ITag {
  text: string;
}

const Tag = ({ text }: ITag) => {
  return (
    <div
      className="px-2 py-1 border border-1 border-secondary rounded text-secondary text-nowrap rounded-4"
      style={{ fontSize: 12 }}
    >
      {text}
    </div>
  );
};
