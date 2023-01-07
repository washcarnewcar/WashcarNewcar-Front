import styles from '../../styles/SelectMap.module.scss';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import Header from '../../src/components/Header';
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { BiCurrentLocation } from 'react-icons/bi';
import { useRouter } from 'next/router';
import Head from 'next/head';

function SelectMap() {
  const router = useRouter();
  const { longitude, latitude, foundLocation } = router.query;
  const [coordinate, setCoordinate] = useState({
    longitude: 126.7059347817178,
    latitude: 37.4527602629939,
  });
  const [textLocation, setTextLocation] = useState('');
  const [locationLoaded, setLocationLoaded] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [bodyHeight, setBodyHeight] = useState(0);

  /**
   * 좌표를 받아와 현재 주소를 주소창에 표시하는 함수
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
        const address = result[0].address;
        setTextLocation(`${address.address_name}`);
        setLocationLoaded(true);
      }
    );
  };

  /**
   * geolocation을 사용해 위치를 받아오는데 성공하면 호출되는 함수
   */
  const positionCallback = (position: GeolocationPosition) => {
    const longitude = position.coords.longitude;
    const latitude = position.coords.latitude;
    // 좌표 State에 저장
    setCoordinate({ latitude: latitude, longitude: longitude });
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

  /**
   * 드래그 할 때 좌표값 변경
   */
  const handleDrag = (target: kakao.maps.Map | React.DragEvent<HTMLDivElement>) => {
    const mapTarget = target as kakao.maps.Map;
    setCoordinate({
      latitude: mapTarget.getCenter().getLat(),
      longitude: mapTarget.getCenter().getLng(),
    });
  };

  /**
   * 줌 할 때 좌표값 변경
   */
  const handleZoomChanged = (target: kakao.maps.Map) => {
    setCoordinate({
      latitude: target.getCenter().getLat(),
      longitude: target.getCenter().getLng(),
    });
  };

  /**
   * 드래그가 끝나면 좌표값을 가지고 텍스트로 변환 후 표시
   */
  const handleDragEnd = () => {
    kakao.maps.load(() => {
      const geocoder = new kakao.maps.services.Geocoder();
      displayLocation(geocoder, coordinate.longitude, coordinate.latitude);
    });
  };

  /**
   * 현위치 버튼을 클릭했을 때 현위치로 이동
   */
  const handleCurrentLocationClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    navigator.geolocation.getCurrentPosition(positionCallback, positionErrorCallback);
  };

  /**
   * 확인 버튼을 눌렀을 때 /search로 이동
   */
  const handleSubmitClick = () => {
    router.push({
      pathname: '/search',
      query: { longitude: coordinate.longitude, latitude: coordinate.latitude },
    });
  };

  /**
   * 현재 스크린 사이즈를 계산
   */
  const setScreenSize = () => {
    const navbarHeight = document.getElementById('navbar')?.clientHeight;
    const vh = window.innerHeight;
    setBodyHeight(vh - (navbarHeight ? navbarHeight : 0));
  };

  useEffect(() => {
    if (!router.isReady) return;

    if (!longitude || !latitude || !foundLocation) {
      router.push('/');
    }

    // search에서 위치정보를 찾지 못했을 때
    else if (!JSON.parse(foundLocation as string)) {
      navigator.geolocation.getCurrentPosition(positionCallback, positionErrorCallback);
    }

    // search에서 위치정보를 찾았을 때
    else {
      const parsedLongitude = parseFloat(longitude as string);
      const parsedLatitude = parseFloat(latitude as string);
      setCoordinate({ latitude: parsedLatitude, longitude: parsedLongitude });

      kakao.maps.load(() => {
        const geocoder = new kakao.maps.services.Geocoder();
        displayLocation(geocoder, parsedLongitude, parsedLatitude);
      });
    }
  }, [router.isReady]);

  useEffect(() => {
    kakao.maps.load(() => {
      console.debug('카카오맵 준비됨');
      setMapReady(true);
    });

    setScreenSize();
    window.addEventListener('resize', () => setScreenSize());
  }, []);

  return (
    <>
      <Head>
        <title>세차새차 - 세차장 검색</title>
      </Head>
      <Header />
      <div style={{ height: bodyHeight }}>
        <div className="position-fixed mx-auto tw-z-10 start-0 end-0 tw-bottom-16 tw-w-5/6">
          <Button
            variant="light"
            className="ms-auto mb-3 tw-w-12 tw-h-12 bg-white rounded-5 shadow p-0 d-flex justify-content-center align-items-center"
            onClick={handleCurrentLocationClick}
          >
            <BiCurrentLocation size={30} className="text-primary" />
          </Button>
          <div className="d-flex justify-content-between align-items-center p-2 rounded shadow bg-white">
            <div className="fs-5 fw-bold ps-2">{textLocation}</div>
            <Button className="fw-bold tw-break-keep" onClick={handleSubmitClick} disabled={!locationLoaded}>
              확인
            </Button>
            {/* TODO: 버튼을 누르면 현위치를 잡을 때까지 spinner 띄우면 좋음 */}
          </div>
        </div>
        {mapReady ? (
          <Map
            center={{ lat: coordinate.latitude, lng: coordinate.longitude }}
            className="h-100"
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            onZoomChanged={handleZoomChanged}
          >
            <MapMarker position={{ lat: coordinate.latitude, lng: coordinate.longitude }}></MapMarker>
          </Map>
        ) : null}
      </div>
    </>
  );
}

export default SelectMap;
