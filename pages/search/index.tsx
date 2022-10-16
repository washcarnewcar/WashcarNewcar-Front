import styles from '../../styles/Search.module.scss';
import { IoIosArrowForward } from 'react-icons/io';
import Header from '../../components/header';
import { useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import Seperator from '../../components/seperator';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Script from 'next/script';

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
   * 최초 렌더 시 위치를 받아온다.
   */
  useEffect(() => {
    window.kakao?.maps.load(() => {
      const geocoder = new window.kakao.maps.services.Geocoder();

      judgeIsState();

      /**
       * /search/map으로부터 받아온 위치 정보가 있는지 판단
       * 없다면 GPS를 사용하여 위치 받아옴
       */
      function judgeIsState() {
        if (
          longitude &&
          latitude &&
          typeof longitude === 'string' &&
          typeof latitude === 'string'
        ) {
          console.log(`location으로부터 좌표값 받아옴`);
          coord2Address(parseFloat(longitude), parseFloat(latitude));
          setCoordinate({
            longitude: parseFloat(longitude),
            latitude: parseFloat(latitude),
          });
        } else {
          console.log(`geolocation으로부터 좌표값 받아옴`);
          getLocationFromGeolocation();
        }
      }

      /**
       * geolocation을 사용하여 위치를 받아오는 함수
       */
      function getLocationFromGeolocation() {
        navigator.geolocation.getCurrentPosition(
          positionCallback,
          positionErrorCallback
        );
      }

      /**
       * geolocation을 사용해 위치를 받아오는데 성공하면 호출되는 함수
       */
      function positionCallback(position: GeolocationPosition) {
        // 좌표를 주소 텍스트로 변환, 좌표 State에 저장
        coord2Address(position.coords.longitude, position.coords.latitude);
        setCoordinate({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      }

      /**
       * geolocation을 사용해 위치를 받아오는데 실패하면 호출되는 함수
       */
      function positionErrorCallback(error: GeolocationPositionError) {
        if (error.code === GeolocationPositionError.PERMISSION_DENIED) {
          console.log('권한 없음');
        } else if (
          error.code === GeolocationPositionError.POSITION_UNAVAILABLE
        ) {
          console.log('위치를 사용할 수 없음');
        }
      }

      /**
       * 좌표를 주소로 변환하여 텍스트로 표시하는 함수
       */
      function coord2Address(longitude: number, latitude: number) {
        // 좌표를 주소로 변환
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
      }
    });
  }, []);

  return (
    <>
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_APPKEY}&libraries=services,clusterer&autoload=false`}
      />
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
        >
          <a className={styles.search_location}>
            <div className={styles.title}>검색 위치</div>
            <div className={styles.right}>
              <div className={styles.current_location}>
                {foundLocation ? textLocation : <BeatLoader size={10} />}
              </div>
              <IoIosArrowForward size={20} />
            </div>
          </a>
        </Link>
        <div className={styles.blank}></div>

        <Item slug="test" />
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
    <Link href={`/store/${slug}`}>
      <a className={styles.link}>
        <div className={styles.container}>
          <div className={styles.title}>
            <img
              src="style_carcare.jpg"
              alt="스타일카케어"
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
      </a>
    </Link>
  );
}

interface ITag {
  text: string;
}

const Tag = ({ text }: ITag) => {
  return <div className={styles.tag_container}>{text}</div>;
};