import styles from './Search.module.scss';
import { IoIosArrowForward } from 'react-icons/io';
import { Link } from 'react-router-dom';
import Item from '../../components/Item';
import Header from '../../components/Header';
import { Accordion } from 'react-bootstrap';
import { useEffect, useState } from 'react';

const Search = () => {
  const [coordinate, setCoordinate] = useState({
    latitude: 37.4527602629939,
    longitude: 126.7059347817178,
  });
  const [carNumber, setCarNumber] = useState('');
  const [brand, setBrand] = useState('');
  const [carText, setCarText] = useState('모두');
  const [textLocation, setTextLocation] = useState('');
  const geocoder = new kakao.maps.services.Geocoder();

  function onBrandChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const index = e.target.selectedIndex;
    const text = e.target.options[index].text;

    if (index !== 0) {
      setBrand(text);
      getCar(value);
    }
  }

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

  function getBrand() {}

  function getCar(brandNumber: string) {
    console.log('getCar()');
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

    // 좌표를 주소로 변환
    geocoder.coord2Address(
      position.coords.longitude,
      position.coords.latitude,
      (
        result: {
          address: kakao.maps.services.Address;
          road_address: kakao.maps.services.RoadAaddress | null;
        }[],
        status: kakao.maps.services.Status
      ) => {
        console.log(result[0].address);
        const address = result[0].address;
        setTextLocation(
          `현위치 : ${address.region_1depth_name} ${address.region_2depth_name} ${address.region_3depth_name}`
        );
      }
    );
  }

  function positionErrorCallback(error: GeolocationPositionError) {
    if (error.code === GeolocationPositionError.PERMISSION_DENIED) {
      console.log('권한 없음');
    } else if (error.code === GeolocationPositionError.POSITION_UNAVAILABLE) {
      console.log('위치를 사용할 수 없음');
    }
  }

  useEffect(() => {
    getBrand();
    getCurrentLocation();
  }, []);

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
          state={{ coordinate: coordinate }}
        >
          <div className={styles.title}>검색 위치 설정</div>
          <div className={styles.right}>
            <div className={styles.current_location}>{textLocation}</div>
            <IoIosArrowForward size={20} />
          </div>
        </Link>
        <div className={styles.blank}></div>

        <Item />
        <hr className={styles.seperator} />
        <Item />
        <hr className={styles.seperator} />
        <Item />
        <hr className={styles.seperator} />
        <Item />

        <Item />
      </div>
    </>
  );
};

export default Search;
