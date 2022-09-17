import styles from './SelectMap.module.scss';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import Header from '../../components/Header';
import { useEffect, useState } from 'react';

const SelectMap = () => {
  const [location, setLocation] = useState({
    latitude: 37.45133,
    longitude: 126.5549982,
  });

  useEffect(() => {
    getCurrentLocation();
  }, []);

  async function getCurrentLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }

  function onDrag(target: kakao.maps.Map) {
    setLocation({
      latitude: target.getCenter().getLat(),
      longitude: target.getCenter().getLng(),
    });
  }

  function onZoomChanged(target: kakao.maps.Map) {
    setLocation({
      latitude: target.getCenter().getLat(),
      longitude: target.getCenter().getLng(),
    });
  }

  return (
    <>
      <Header type={1} />
      <Map
        center={{ lat: location.latitude, lng: location.longitude }}
        className={styles.map}
        onDrag={onDrag}
        onZoomChanged={onZoomChanged}
      >
        <MapMarker
          position={{ lat: location.latitude, lng: location.longitude }}
        ></MapMarker>
      </Map>
    </>
  );
};

export default SelectMap;
