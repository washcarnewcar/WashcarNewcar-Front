import classNames from 'classnames';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Alert, Button, ButtonGroup, ListGroup } from 'react-bootstrap';
import { IoIosArrowForward } from 'react-icons/io';
import Header from '../../../components/header';
import Loading from '../../../components/loading';
import { requestWithToken } from '../../../functions/request';
import styles from '../../../styles/Provider.module.scss';

interface ResponseJson {
  first: boolean;
  menus: Array<Menu>;
}

interface Menu {
  name: string;
  code: string;
}

export default function Provider() {
  // 임시로 true
  const router = useRouter();
  const { slug } = router.query;
  const [ready, setReady] = useState(true);
  const [menuList, setMenuList] = useState(new Array<Menu>());

  useEffect(() => {
    // getCalendarList();
  }, []);

  const getCalendarList = async () => {
    const response = await requestWithToken('/provider/calendar/list');
    if (response.ok) {
      const json: ResponseJson = await response.json();

      if (json.first) {
        // 처음 매장 생성
        router.replace('/provider/store');
      } else {
        setMenuList(json.menus);
        setReady(true);
        console.log(json);
      }
    } else if (response.status === 401) {
      router.replace('/login');
    } else if (response.status === 403) {
      router.replace('/contact');
    } else {
      router.replace('/error');
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
      <div className={styles.container}>
        <div className={styles.status_container}>
          <Alert className={styles.status}>매장 승인 대기중입니다.</Alert>
        </div>

        <div className={styles.menus_container}>
          <div className={styles.title}>세차 예약 요청</div>
          <List />
        </div>

        <div className={styles.menus_container}>
          <div className={styles.title}>오늘의 세차 스케줄</div>
          <List />
        </div>

        <div className={styles.menus_container}>
          <div className={styles.title}>매장 관리</div>
          <div className={styles.buttongroup}>
            <Link href={`/provider/${slug}/store`}>
              <Button className={styles.button} variant="outline-primary">
                매장 정보 설정
              </Button>
            </Link>
            <Link href={`/provider/${slug}/menu`}>
              <Button className={styles.button} variant="outline-primary">
                메뉴 관리
              </Button>
            </Link>
            <Link href={`/provider/${slug}/time`}>
              <Button className={styles.button} variant="outline-primary">
                매장 운영 시간 설정
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function List() {
  return (
    <ListGroup className={classNames(styles.list, styles.reqest)}>
      <ListGroup.Item>
        <Link href="/provider/hello/reservation/1">
          <a className={styles.link}>
            <div className={styles.content_container}>
              <div>
                <div className={styles.menu}>외부 세차</div>
                <div className={styles.car}>기아 EV6 / 31하 1450</div>
                <div className={styles.date}>
                  {moment().format('YYYY.MM.DD(dd) HH:mm')}
                </div>
              </div>
              <div className={styles.arrow}>
                <IoIosArrowForward size={25} />
              </div>
            </div>
          </a>
        </Link>
      </ListGroup.Item>
      <ListGroup.Item>
        <Link href="/">
          <a className={styles.link}>
            <div className={styles.content_container}>
              <div>
                <div className={styles.menu}>외부 세차</div>
                <div className={styles.car}>기아 EV6 / 31하 1450</div>
                <div className={styles.date}>
                  {moment().format('YYYY.MM.DD(dd) HH:mm')}
                </div>
              </div>
              <div className={styles.arrow}>
                <IoIosArrowForward size={25} />
              </div>
            </div>
          </a>
        </Link>
      </ListGroup.Item>
      <ListGroup.Item>
        <Link href="/">
          <a className={styles.link}>
            <div className={styles.content_container}>
              <div>
                <div className={styles.menu}>외부 세차</div>
                <div className={styles.car}>기아 EV6 / 31하 1450</div>
                <div className={styles.date}>
                  {moment().format('YYYY.MM.DD(dd) HH:mm')}
                </div>
              </div>
              <div className={styles.arrow}>
                <IoIosArrowForward size={25} />
              </div>
            </div>
          </a>
        </Link>
      </ListGroup.Item>
    </ListGroup>
  );
}
