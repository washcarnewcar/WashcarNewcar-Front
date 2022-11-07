import styles from '../../styles/SelectMap.module.scss';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import Header from '../../components/header';
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { BiCurrentLocation } from 'react-icons/bi';
import { useRouter } from 'next/router';

function SelectMap() {
  const router = useRouter();
  const { longitude, latitude, foundLocation } = router.query;
  const [coordinate, setCoordinate] = useState({
    latitude: 37.4527602629939,
    longitude: 126.7059347817178,
  });
  const [textLocation, setTextLocation] = useState('');
  const [locationLoaded, setLocationLoaded] = useState(false);
  const [geocoder, setGeocoder] = useState<
    { coord2Address: Function } | undefined
  >();

  /**
   * 현재 주소를 주소창에 표시하는 함수
   */
  const displayLocation = useCallback(
    (longitude: number, latitude: number) => {
      geocoder?.coord2Address(
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
    },
    [geocoder]
  );

  /**
   * geolocation을 사용해 위치를 받아오는데 성공하면 호출되는 함수
   */
  const positionCallback = useCallback(
    (position: GeolocationPosition) => {
      // 좌표 State에 저장
      setCoordinate({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      displayLocation(position.coords.longitude, position.coords.latitude);
    },
    [displayLocation]
  );

  /**
   * geolocation을 사용해 위치를 받아오는데 실패하면 호출되는 함수
   */
  const positionErrorCallback = useCallback(
    (error: GeolocationPositionError) => {
      if (error.code === GeolocationPositionError.PERMISSION_DENIED) {
        console.log('권한 없음');
      } else if (error.code === GeolocationPositionError.POSITION_UNAVAILABLE) {
        console.log('위치를 사용할 수 없음');
      }
    },
    []
  );

  /**
   * geolocation으로부터 위치를 얻어오는 함수
   */
  const getLocationFromGeolocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      positionCallback,
      positionErrorCallback
    );
  }, [positionCallback, positionErrorCallback]);

  /**
   * /search에서 위치를 찾고 왔는지 확인
   */
  const judgeFoundLocation = useCallback(() => {
    const boolFoundLocation = JSON.parse(foundLocation as string);
    if (boolFoundLocation && longitude && latitude) {
      console.log(`found`);

      const tempLongitude = parseFloat(longitude as string);
      const tempLatitude = parseFloat(latitude as string);
      setCoordinate({
        longitude: tempLongitude,
        latitude: tempLatitude,
      });
      displayLocation(tempLongitude, tempLatitude);
    } else {
      console.log(`not found`);
      getLocationFromGeolocation();
    }
  }, [
    longitude,
    latitude,
    displayLocation,
    foundLocation,
    getLocationFromGeolocation,
  ]);

  /**
   * 드래그 할 때 좌표값 변경
   */
  const handleDrag = useCallback(
    (target: kakao.maps.Map | React.DragEvent<HTMLDivElement>) => {
      const mapTarget = target as kakao.maps.Map;
      setCoordinate({
        latitude: mapTarget.getCenter().getLat(),
        longitude: mapTarget.getCenter().getLng(),
      });
    },
    []
  );

  /**
   * 줌 할 때 좌표값 변경
   */
  const handleZoomChanged = useCallback((target: kakao.maps.Map) => {
    setCoordinate({
      latitude: target.getCenter().getLat(),
      longitude: target.getCenter().getLng(),
    });
  }, []);

  /**
   * 드래그가 끝나면 좌표값을 가지고 텍스트로 변환 후 표시
   */
  const handleDragEnd = useCallback(() => {
    displayLocation(coordinate.longitude, coordinate.latitude);
  }, [displayLocation, coordinate]);

  /**
   * 현위치 버튼을 클릭했을 때 현위치로 이동
   */
  const handleCurrentLocationClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      getLocationFromGeolocation();
    },
    [getLocationFromGeolocation]
  );

  /**
   * 확인 버튼을 눌렀을 때 /search로 이동
   */
  const handleSubmitClick = useCallback(() => {
    router.push({
      pathname: '/search',
      query: { longitude: coordinate.longitude, latitude: coordinate.latitude },
    });
  }, [router, coordinate]);

  /**
   * 현재 스크린 사이즈를 계산하여 css에 적용
   */
  const setScreenSize = useCallback(() => {
    let vh = window.innerHeight;
    document.documentElement.style.setProperty('--vh', `${vh - 56}px`);
  }, []);

  useEffect(() => {
    /**
     * /search로부터 정보를 받아오지 못했다면
     * (정상 시나리오가 아니라면)
     * 루트로 보낸다
     */
    console.log(longitude, latitude);

    if (!longitude || !latitude) {
      router.push('/');
    }

    /**
     * geocoder를 받아와 세팅한다.
     */
    kakao.maps.load(() => {
      setGeocoder(new kakao.maps.services.Geocoder());
    });

    setScreenSize();
    window.addEventListener('resize', () => setScreenSize());
  }, [latitude, longitude, setScreenSize, router]);

  /**
   * 처음 로딩되면 좌표값을 가지고 텍스트로 변환 후 표시
   */
  useEffect(() => {
    // geocoder가 정상적으로 로딩되었는지 확인
    if (geocoder?.coord2Address) {
      judgeFoundLocation();
    }
  }, [geocoder, judgeFoundLocation]);

  return (
    <>
      <Header type={1} />
      <div className={styles.body}>
        <div className={styles.address_container}>
          <div className={styles.address}>{textLocation}</div>
          <Button
            className={styles.submit_button}
            onClick={handleSubmitClick}
            disabled={!locationLoaded}
          >
            확인
          </Button>
          {/* TODO: 버튼을 누르면 현위치를 잡을 때까지 spinner 띄우면 좋음 */}
          <button
            className={styles.current_location}
            onClick={handleCurrentLocationClick}
          >
            <BiCurrentLocation size={30} color="#2964F6" />
          </button>
        </div>
        {geocoder ? (
          <Map
            center={{ lat: coordinate.latitude, lng: coordinate.longitude }}
            className={styles.map}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            onZoomChanged={handleZoomChanged}
          >
            <MapMarker
              position={{ lat: coordinate.latitude, lng: coordinate.longitude }}
            ></MapMarker>
          </Map>
        ) : null}
      </div>
    </>
  );
}

export default SelectMap;
