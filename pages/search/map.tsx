import styles from '../../styles/SelectMap.module.scss';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import Header from '../../components/header';
import {
  DragEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Button } from 'react-bootstrap';
import { BiCurrentLocation } from 'react-icons/bi';
import { useRouter } from 'next/router';
import Script from 'next/script';

function SelectMap() {
  const router = useRouter();
  const { longitude, latitude, foundLocation } = router.query;
  const [coordinate, setCoordinate] = useState({
    latitude: 37.4527602629939,
    longitude: 126.7059347817178,
  });
  const [textLocation, setTextLocation] = useState('');
  const [locationLoaded, setLocationLoaded] = useState(false);
  let geocoder: any;

  useEffect(() => {
    /**
     * /search로부터 정보를 받아오지 못했다면
     * (정상 시나리오가 아니라면)
     * 루트로 보낸다
     */
    if (
      !longitude ||
      !latitude ||
      typeof longitude !== 'string' ||
      typeof latitude !== 'string'
    ) {
      router.push('/');
    }

    window.kakao?.maps.load(() => {
      geocoder = new kakao.maps.services.Geocoder();
    });

    judgeFoundLocation();
    setScreenSize();
    window.addEventListener('resize', () => setScreenSize());
  }, []);

  /**
   * 좌표값이 바뀌면 좌표값을 가지고 텍스트로 변환 후 표시
   */
  useEffect(() => {
    geocoder?.coord2Address(
      coordinate.longitude,
      coordinate.latitude,
      (
        result: {
          address: kakao.maps.services.Address;
          road_address: kakao.maps.services.RoadAaddress | null;
        }[],
        status: kakao.maps.services.Status
      ) => {
        const address = result[0].address;
        setTextLocation(`${address.address_name}`);
        setLocationLoaded(true);
      }
    );
  }, [coordinate]);

  /**
   * geolocation으로부터 위치를 얻어오는 함수
   */
  function getLocationFromGeolocation() {
    navigator.geolocation.getCurrentPosition(
      positionCallback,
      positionErrorCallback
    );
  }

  /**
   * /search에서 위치를 찾고 왔는지 확인
   */
  function judgeFoundLocation() {
    if (
      foundLocation &&
      typeof longitude === 'string' &&
      typeof latitude === 'string'
    ) {
      setCoordinate({
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
      });
    } else {
      getLocationFromGeolocation();
    }
  }

  /**
   * geolocation을 사용해 위치를 받아오는데 성공하면 호출되는 함수
   */
  function positionCallback(position: GeolocationPosition) {
    // 좌표 State에 저장
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
    } else if (error.code === GeolocationPositionError.POSITION_UNAVAILABLE) {
      console.log('위치를 사용할 수 없음');
    }
  }

  /**
   * 드래그 할 때 좌표값 변경
   */
  function onDrag(target: any) {
    setCoordinate({
      latitude: target.getCenter().getLat(),
      longitude: target.getCenter().getLng(),
    });
  }

  /**
   * 줌 할 때 좌표값 변경
   */
  function onZoomChanged(target: kakao.maps.Map) {
    setCoordinate({
      latitude: target.getCenter().getLat(),
      longitude: target.getCenter().getLng(),
    });
  }

  /**
   * 현위치 버튼을 클릭했을 때 현위치로 이동
   */
  function onCurrentLocationClick(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    getLocationFromGeolocation();
  }

  /**
   * 확인 버튼을 눌렀을 때 /search로 이동
   */
  function onSubmitClick() {
    router.push({
      pathname: '/search',
      query: { longitude: coordinate.longitude, latitude: coordinate.latitude },
    });
  }

  /**
   * 현재 스크린 사이즈를 계산하여 css에 적용
   */
  function setScreenSize() {
    let vh = window.innerHeight;
    document.documentElement.style.setProperty('--vh', `${vh - 56}px`);
  }

  return (
    <>
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_APPKEY}&libraries=services,clusterer&autoload=false`}
      />
      <Header type={1} />
      <div className={styles.body}>
        <div className={styles.address_container}>
          <div className={styles.address}>{textLocation}</div>
          <Button
            className={styles.submit_button}
            onClick={onSubmitClick}
            disabled={!locationLoaded}
          >
            확인
          </Button>
          {/* TODO: 버튼을 누르면 현위치를 잡을 때까지 spinner 띄우면 좋음 */}
          <button
            className={styles.current_location}
            onClick={onCurrentLocationClick}
          >
            <BiCurrentLocation size={30} color="#2964F6" />
          </button>
        </div>
        <Map
          center={{ lat: coordinate.latitude, lng: coordinate.longitude }}
          className={styles.map}
          onDrag={onDrag}
          onZoomChanged={onZoomChanged}
        >
          <MapMarker
            position={{ lat: coordinate.latitude, lng: coordinate.longitude }}
          ></MapMarker>
        </Map>
      </div>
    </>
  );
}

export default SelectMap;