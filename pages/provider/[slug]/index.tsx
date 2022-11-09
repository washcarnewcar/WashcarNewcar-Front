import classNames from 'classnames';
import moment from 'moment';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Alert, Button, ButtonGroup, ListGroup } from 'react-bootstrap';
import { IoIosArrowForward } from 'react-icons/io';
import Header from '../../../src/components/Header';
import Loading from '../../../src/components/Loading';
import UserContext from '../../../src/contexts/UserProvider';
import { requestWithToken } from '../../../src/functions/request';
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
  const { user, setUser } = useContext(UserContext);
  const { slug } = router.query;
  const [ready, setReady] = useState(true);
  const [menuList, setMenuList] = useState(new Array<Menu>());

  const getCalendarList = useCallback(async () => {
    if (router && slug) {
      const response = await requestWithToken(
        router,
        setUser,
        `/provider/${slug}/schedule`,
        { method: 'GET' }
      );
      console.log(response);
    }
  }, [router, slug, setUser]);

  useEffect(() => {
    getCalendarList();
  }, [getCalendarList]);

  if (!ready) {
    return (
      <div style={{ width: '100%', height: '100vh' }}>
        <Loading />
      </div>
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

export const getStaticPaths: GetStaticPaths = async () => {
  console.log('hello');

  return {
    paths: [{ params: { slug: 'hello' } }],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async () => {
  console.log('hello');
  return {
    props: {
      posts: 'hello',
    },
  };
};
