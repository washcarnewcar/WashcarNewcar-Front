import styles from '../styles/Header.module.scss';
import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import Link from 'next/link';

interface HeaderProps {
  type: number;
}

export default function Header({ type }: HeaderProps) {
  if (type === 1) {
    return (
      <Navbar sticky="top" bg="white" expand={false} id={styles.container}>
        <Container>
          <Link href="/">
            <a>
              <Navbar.Brand>
                <img
                  className={styles.main_logo}
                  src="/row_logo.png"
                  alt="세차새차"
                />
              </Navbar.Brand>
            </a>
          </Link>
          <Navbar.Toggle />
          <Navbar.Offcanvas placement="end" style={{ width: '300px' }}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>세차새차</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Link href="/auth/login">
                <a>로그인</a>
              </Link>
              <Nav.Link>로그아웃</Nav.Link>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    );
  } else if (type === 2) {
    return (
      <Navbar sticky="top" bg="white" expand={false} id={styles.container2}>
        <Container className={styles.logo_container}>
          <Link href="/">
            <a>
              <Navbar.Brand>
                <img
                  className={styles.text_logo}
                  src="/carwash.png"
                  alt="세차새차"
                />
                <img
                  className={styles.main_logo}
                  src="메인로고.png"
                  alt="로고"
                />
              </Navbar.Brand>
            </a>
          </Link>
        </Container>
      </Navbar>
    );
  }
  return <></>;
}
