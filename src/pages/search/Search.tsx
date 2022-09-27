import styles from './Search.module.scss';
import { IoIosArrowForward } from 'react-icons/io';
import { Link, useLocation } from 'react-router-dom';
import Item from '../../components/Item';
import Header from '../../components/Header';
import { Accordion } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import Seperator from '../../components/Seperator';

const Search = () => {
  const [coordinate, setCoordinate] = useState({
    // 길튼교회 좌표
    latitude: 37.4527602629939,
    longitude: 126.7059347817178,
  });
  const [carNumber, setCarNumber] = useState('');
  const [brand, setBrand] = useState('');
  const [carText, setCarText] = useState('모두');
  const [textLocation, setTextLocation] = useState('');
  const [foundLocation, setFoundLocation] = useState(false);
  const geocoder = new kakao.maps.services.Geocoder();
  const location = useLocation();

  /**
   * 최초 렌더 시 Brand와 위치를 받아온다.
   */
  useEffect(() => {
    getBrand();
    judgeIsState();
  }, []);

  /**
   * 브랜드가 바뀌었을 때
   */
  function onBrandChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const index = e.target.selectedIndex;
    const text = e.target.options[index].text;

    if (index !== 0) {
      setBrand(text);
      getCar(value);
    }
  }

  /**
   * 차 모델이 바뀌었을 때
   */
  function onCarChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const index = e.target.selectedIndex;
    const text = e.target.options[index].text;

    if (index === 0) {
      setCarText('모두');
    } else {
      setCarNumber(value);
      setCarText(`${brand} ${text}`);
    }
  }

  /**
   * 브랜드를 받아오는 함수
   */
  function getBrand() {}

  /**
   * 차 모델을 받아오는 함수
   */
  function getCar(brandNumber: string) {
    console.log('getCar()');
  }

  /**
   * /search/map으로부터 받아온 위치 정보가 있는지 판단
   * 없다면 GPS를 사용하여 위치 받아옴
   */
  function judgeIsState() {
    if (location.state?.coordinate) {
      setCoordinate(location.state.coordinate);
      setFoundLocation(true);
    } else {
      getLocationFromGeolocation();
    }
  }

  /**
   * geolocation을 사용하여 위치를 받아오는 함수
   */
  async function getLocationFromGeolocation() {
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
    setFoundLocation(true);
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
   * coordinate가 바뀌면 좌표를 주소로 변환하여 텍스트로 표시
   */
  useEffect(() => {
    // 좌표를 주소로 변환
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
        setTextLocation(
          `${address.region_1depth_name} ${address.region_2depth_name} ${address.region_3depth_name}`
        );
      }
    );
  }, [coordinate]);

  return (
    <>
      <Header type={1} />
      <div className={styles.container}>
        <Accordion flush>
          <Accordion.Item eventKey="0" className={styles.select_car_item}>
            <Accordion.Header>
              <div className={styles.select_car_header}>
                <div className={styles.title}>차량 선택</div>
                <div className={styles.car}>{carText}</div>
              </div>
            </Accordion.Header>
            <Accordion.Body className={styles.select_car_body}>
              <select className={styles.brand} onChange={onBrandChange}>
                <option value="select">브랜드 선택</option>
                <option value="0">현대</option>
                <option value="1">제네시스</option>
                <option value="2">쉐보레</option>
                <option value="3">GM</option>
              </select>
              <select onChange={onCarChange}>
                <option value="select">모델 선택</option>
                <option value="0">EF쏘나타</option>
                <option value="1">i30</option>
                <option value="2">i40</option>
                <option value="3">LF쏘나타</option>
                <option value="4">NF쏘나타</option>
                <option value="5">YF쏘나타</option>
              </select>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <hr className={styles.seperator} />
        <Link
          to="/search/map"
          className={styles.search_location}
          state={{
            coordinate: coordinate,
            foundLocation: foundLocation,
          }}
        >
          <div className={styles.title}>검색 위치 설정</div>
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
};

export default Search;