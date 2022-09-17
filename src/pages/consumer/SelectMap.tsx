import styles from './SelectMap.module.scss';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import Header from '../../components/Header';
import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

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

  useEffect(() => {
    getCoordinate();
    setScreenSize();
    window.addEventListener('resize', () => setScreenSize());
    getCurrentLocation();
  }, []);

  function getCoordinate() {
    setCoordinate(location.state.coordinate);
  }

  async function getCurrentLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      setCoordinate({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }

  function onDrag(target: kakao.maps.Map) {
    setCoordinate({
      latitude: target.getCenter().getLat(),
      longitude: target.getCenter().getLng(),
    });
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

  if (!location.state?.coordinate) {
    return <Navigate to="/search"></Navigate>;
  }

  return (
    <>
      <Header type={1} />
      <div className={styles.body}>
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
        <Link to="/search">
          <button>확인...</button>
        </Link>
      </div>
    </>
  );
};

export default SelectMap;
