import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Button, ButtonGroup, ListGroup } from 'react-bootstrap';
import { IoIosArrowForward } from 'react-icons/io';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import { requestWithToken } from '../../functions/request';
import styles from './Provider.module.scss';

interface ResponseJson {
  first: boolean;
  menus: Array<Menu>;
}

interface Menu {
  name: string;
  code: string;
}

function Provider() {
  // 임시로 true
  const [ready, setReady] = useState(true);
  const [menuList, setMenuList] = useState(new Array<Menu>());

  return (
    <>
      <div className={styles.container}>
        <ListGroup className={styles.list_container}>
          <ListGroup.Item variant="secondary">세차메뉴 입력 +</ListGroup.Item>
          {menuList.map((menu: Menu) => (
            <LinkContainer to={'/provider/menu/' + menu.code}>
              <ListGroup.Item key={menu.name} className={styles.list_item}>
                <div>{menu.name}</div>
                <IoIosArrowForward size={20} />
              </ListGroup.Item>
            </LinkContainer>
          ))}
        </ListGroup>
      </div>
    </>
  );
}

export default Provider;
