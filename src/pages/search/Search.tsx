import styles from './Search.module.scss';
import { IoIosArrowForward } from 'react-icons/io';
import { Link, useLocation } from 'react-router-dom';
import Item from '../../components/Item';
import Header from '../../components/Header';
import { useEffect, useMemo, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import Seperator from '../../components/Seperator';

function Search() {
  const [coordinate, setCoordinate] = useState({
    // 길튼교회 좌표
    latitude: 37.4527602629939,
    longitude: 126.7059347817178,
  });
  const [textLocation, setTextLocation] = useState('');
  const [foundLocation, setFoundLocation] = useState(false);
  const geocoder = useMemo(() => new kakao.maps.services.Geocoder(), []);
  const location = useLocation();

  /**
   * 최초 렌더 시 위치를 받아온다.
   */
  useEffect(() => {
    judgeIsState();

    /**
     * /search/map으로부터 받아온 위치 정보가 있는지 판단
     * 없다면 GPS를 사용하여 위치 받아옴
     */
    function judgeIsState() {
      if (location.state?.coordinate) {
        console.log(`location으로부터 좌표값 받아옴`);
        coord2Address(
          location.state.coordinate.longitude,
          location.state.coordinate.latitude
        );
        setCoordinate(location.state.coordinate);
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
      } else if (error.code === GeolocationPositionError.POSITION_UNAVAILABLE) {
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
  }, [geocoder, location]);

  return (
    <>
      <Header type={1} />
      <div className={styles.container}>
        <Link
          to="/search/map"
          className={styles.search_location}
          state={{
            coordinate: coordinate,
            foundLocation: foundLocation,
          }}
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

export default Search;
