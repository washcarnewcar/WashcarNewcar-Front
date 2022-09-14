import styles from './Search.module.scss';
import Datepicker from '../../components/Datepicker';
import { IoIosArrowForward } from 'react-icons/io';
import { BsCheckCircleFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import Item from '../../components/Item';
import classNames from 'classnames';
import Header from '../../components/Header';
import { Accordion, Dropdown, DropdownButton } from 'react-bootstrap';
import { NONAME } from 'dns';
import { useState } from 'react';

const Search = () => {
  const [car, setCar] = useState('');
  const [brand, setBrand] = useState('브랜드');

  function onBrandSelect(eventKey: string | null) {
    if (!eventKey) return null;
    setBrand(eventKey);
  }

  return (
    <>
      <Header type={1} />
      <div className={styles.container}>
        <Accordion flush>
          <Accordion.Item eventKey="0" className={styles.select_car_item}>
            <Accordion.Header>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginRight: '10px',
                }}
              >
                <div style={{ fontSize: 'large', fontWeight: 'bolder' }}>
                  차량 선택
                </div>
                <div>{car}</div>
              </div>
            </Accordion.Header>
            <Accordion.Body>
              <DropdownButton
                variant="outline-primary"
                title={brand}
                onSelect={onBrandSelect}
              >
                <Dropdown.Item eventKey="여기에 브랜드 입력">
                  여기에 브랜드 입력
                </Dropdown.Item>
              </DropdownButton>
            </Accordion.Body>
          </Accordion.Item>
          <hr className={styles.seperator} />
        </Accordion>
        <div
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 16,
            paddingBottom: 16,
          }}
        >
          <Link
            to="/search/map"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'black',
            }}
          >
            <div
              style={{
                fontSize: 'large',
                fontWeight: 'bolder',
              }}
            >
              검색 위치 설정
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ marginRight: '10px' }}>
                현위치 : 인하공업전문대학
              </div>
              <IoIosArrowForward size={23} />
            </div>
          </Link>
        </div>
        <div
          style={{ width: '100%', height: '13px', backgroundColor: '#f7f7f7' }}
        ></div>

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
