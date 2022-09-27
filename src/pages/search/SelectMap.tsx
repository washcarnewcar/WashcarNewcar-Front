import styles from './SelectMap.module.scss';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import Header from '../../components/Header';
import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { BiCurrentLocation } from 'react-icons/bi';

interface Coordinate {
  latitude: number;
  longitude: number;
}

const SelectMap = () => {
  const location = useLocation();
  const [coordinate, setCoordinate] = useState({
    latitude: 37.4527602629939,
    longitude: 126.7059347817178,
  });
  const [textLocation, setTextLocation] = useState('');
  const geocoder = new kakao.maps.services.Geocoder();
  const navigate = useNavigate();
  const [locationLoaded, setLocationLoaded] = useState(false);

  useEffect(() => {
    judgeFoundLocation();
    // getCoordinate();
    setScreenSize();
    window.addEventListener('resize', () => setScreenSize());
  }, []);

  /**
   * /search에서 위치를 찾고 왔는지 확인
   */
  function judgeFoundLocation() {
    if (location.state?.foundLocation) {
      setCoordinate(location.state.coordinate);
    } else {
      getLocationFromGeolocation();
    }
  }

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
   * 좌표값이 바뀌면 좌표값을 가지고 텍스트로 변환 후 표시
   */
  useEffect(() => {
    geocoder.coord2Address(
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
   * 드래그 할 때 좌표값 변경
   */
  function onDrag(target: kakao.maps.Map) {
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
    navigate('/search', { state: { coordinate: coordinate } });
  }

  /**
   * 현재 스크린 사이즈를 계산하여 css에 적용
   */
  function setScreenSize() {
    let vh = window.innerHeight;
    document.documentElement.style.setProperty('--vh', `${vh - 56}px`);
  }

  /**
   * 위도와 경도를 받아서 textLocation에 주소를 찍는 함수
   */
  function coord2Address() {}

  /**
   * /search로부터 정보를 받아오지 못했다면
   * (정상 시나리오가 아니라면)
   * 루트로 보낸다
   */
  if (!location.state?.coordinate) {
    return <Navigate to="/search"></Navigate>;
  }

  return (
    <>
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
};

export default SelectMap;
