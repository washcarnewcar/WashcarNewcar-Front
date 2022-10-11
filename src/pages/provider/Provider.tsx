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
  const navigate = useNavigate();

  useEffect(() => {
    getCalendarList();
  }, []);

  const getCalendarList = async () => {
    const response = await requestWithToken('/provider/calendar/list');
    if (response.ok) {
      const json: ResponseJson = await response.json();

      if (json.first) {
        // 처음 매장 생성
        navigate('/provider/store', { replace: true });
      } else {
        setMenuList(json.menus);
        setReady(true);
        console.log(json);
      }
    } else if (response.status === 401) {
      navigate('/login', { replace: true });
    } else if (response.status === 403) {
      navigate('/contact', { replace: true });
    } else {
      navigate('/error', { replace: true });
    }
  };

  if (!ready) {
    return (
      <>
        <div style={{ width: '100%', height: '100vh' }}>
          <Loading />
        </div>
      </>
    );
  }

  return (
    <>
      <Header type={1} />
      <div id={styles.container}>
        <ButtonGroup>
          <LinkContainer
            to="/매장주소로이동"
            className={styles.store_edit_button_link}
          >
            <Button
              className={styles.store_show_button}
              variant="outline-primary"
            >
              매장 페이지 보기
            </Button>
          </LinkContainer>
          <LinkContainer
            to="/provider/store"
            className={styles.store_edit_button_link}
          >
            <Button className={styles.store_edit_button}>매장 정보 변경</Button>
          </LinkContainer>
        </ButtonGroup>
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
