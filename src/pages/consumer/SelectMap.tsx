import styles from './SelectMap.module.scss';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import Header from '../../components/Header';
import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

interface Coordinate {
  latitude: number;
  longitude: number;
}

// TODO: 주소 검색창 만들어야함.
// TODO: 확인 버튼 눌러서 search로 전달해줘야함.

const SelectMap = () => {
  const location = useLocation();
  const [coordinate, setCoordinate] = useState({
    latitude: 37.4527602629939,
    longitude: 126.7059347817178,
  });
  const [textLocation, setTextLocation] = useState('');
  const geocoder = new kakao.maps.services.Geocoder();

  useEffect(() => {
    getCoordinate();
    setScreenSize();
    window.addEventListener('resize', () => setScreenSize());
    getCurrentLocation();
  }, []);

  function getCoordinate() {
    setCoordinate(location.state.coordinate);
  }

  function onDrag(target: kakao.maps.Map) {
    setCoordinate({
      latitude: target.getCenter().getLat(),
      longitude: target.getCenter().getLng(),
    });
  }

  function onDragEnd(
    target: kakao.maps.Map,
    mouseEvent: kakao.maps.event.MouseEvent
  ) {
    setCoordinate({
      latitude: target.getCenter().getLat(),
      longitude: target.getCenter().getLng(),
    });

    coord2Address(target.getCenter().getLng(), target.getCenter().getLat());
  }

  function onZoomChanged(target: kakao.maps.Map) {
    setCoordinate({
      latitude: target.getCenter().getLat(),
      longitude: target.getCenter().getLng(),
    });
  }

  function setScreenSize() {
    let vh = window.innerHeight;
    document.documentElement.style.setProperty('--vh', `${vh - 56}px`);
  }

  async function getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      positionCallback,
      positionErrorCallback
    );
  }

  function positionCallback(position: GeolocationPosition) {
    // 좌표 State에 저장
    setCoordinate({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });

    // 좌표를 주소로 변환하여 textLocation에 저장
    coord2Address(position.coords.longitude, position.coords.latitude);
  }

  function positionErrorCallback(error: GeolocationPositionError) {
    if (error.code === GeolocationPositionError.PERMISSION_DENIED) {
      console.log('권한 없음');
    } else if (error.code === GeolocationPositionError.POSITION_UNAVAILABLE) {
      console.log('위치를 사용할 수 없음');
    }
  }

  // 위도와 경도를 받아서 textLocation에 주소를 찍는 함수
  function coord2Address(longitude: number, latitude: number) {
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
        console.log(result[0].address);
        const address = result[0].address;
        setTextLocation(`${address.address_name}`);
      }
    );
  }

  if (!location.state?.coordinate) {
    return <Navigate to="/search"></Navigate>;
  }

  return (
    <>
      <Header type={1} />
      <div className={styles.body}>
        <div className={styles.address_container}>
          <div className={styles.address}>{textLocation}</div>
          <Button className={styles.submit_button}>확인</Button>
        </div>
        <Map
          center={{ lat: coordinate.latitude, lng: coordinate.longitude }}
          className={styles.map}
          onDrag={onDrag}
          onZoomChanged={onZoomChanged}
          onDragEnd={onDragEnd}
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
