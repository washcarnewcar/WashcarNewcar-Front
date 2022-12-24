import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { BeatLoader } from 'react-spinners';
import Header from '../../src/components/Header';
import Seperator from '../../src/components/Seperator';
import styles from '../../styles/Search.module.scss';

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
  const displayLocation = (
    geocoder: kakao.maps.services.Geocoder,
    longitude: number,
    latitude: number
  ) => {
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
          setTextLocation(
            `${address.region_1depth_name} ${address.region_2depth_name} ${address.region_3depth_name}`
          );
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
    /**
     * url에 longitude와 latitude가 없을 시 gps를 통해 위치를 가져온다.
     */
    if (!longitude || !latitude) {
      navigator.geolocation.getCurrentPosition(
        positionCallback,
        positionErrorCallback
      );
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
  }, [longitude, latitude]);

  return (
    <>
      <Header type={1} />
      <div className={styles.container}>
        <Link
          href={{
            pathname: '/search/map',
            query: {
              longitude: coordinate.longitude,
              latitude: coordinate.latitude,
              foundLocation: foundLocation,
            },
          }}
          className={styles.search_location}
        >
          <div className={styles.title}>검색 위치</div>
          <div className={styles.right}>
            <div className={styles.current_location}>
              {foundLocation ? textLocation : <BeatLoader size={10} />}
            </div>
            <IoIosArrowForward size={20} />
          </div>
        </Link>
        <div className={styles.blank}></div>

        <Item slug="stylecarcare" />
        <Seperator />
        <Item slug="test" />
        <Seperator />
        <Item slug="test" />
        <Seperator />
        <Item slug="test" />
        <Seperator />
        <Item slug="test" />
      </div>
    </>
  );
}

interface ItemProps {
  slug: string;
}

function Item({ slug }: ItemProps) {
  return (
    <Link href={`/store/${slug}`} className={styles.link}>
      <div className={styles.container}>
        <div className={styles.item_info}>
          <Image
            src="/style_carcare.jpg"
            alt="스타일카케어"
            width={60}
            height={60}
            className={styles.image}
          />
          <div className={styles.text}>
            <div className={styles.name}>스타일카케어</div>
            <div className={styles.subtext}>
              <div className={styles.distance}>0.3km</div>
              <div className={styles.ratings}>
                ⭐️<span className={styles.number}>4.7</span>(200+)
              </div>
            </div>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.inner1}>
            <Tag text="기본세차 38,500원" />
            <Tag text="스페셜세차 66,000원" />
            <Tag text="프리미엄세차 126,000원" />
          </div>
          {/* <div className={styles.inner2}>
            <Tag text="10:00" />
            <Tag text="10:30" />
            <Tag text="11:00" />
            <Tag text="12:00" />
            <Tag text="12:30" />
          </div> */}
        </div>
      </div>
    </Link>
  );
}

interface ITag {
  text: string;
}

const Tag = ({ text }: ITag) => {
  return <div className={styles.tag_container}>{text}</div>;
};
