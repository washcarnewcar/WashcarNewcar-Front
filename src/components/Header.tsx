import styles from '../../styles/Header.module.scss';
import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { useContext } from 'react';
import UserContext from '../context/UserProvider';
import { useRouter } from 'next/router';

interface HeaderProps {
  type: number;
}

export default function Header({ type }: HeaderProps) {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);

  const handleLogoutClick = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      router.replace('/');
    }
  };

  return (
    <Navbar sticky="top" bg="white" expand="sm" className={styles.container}>
      <Container>
        <Link href="/" style={{ display: 'flex' }}>
          <Image
            className={styles.main_logo}
            src="/row_logo.png"
            alt="세차새차"
            width={146}
            height={40}
            priority
          />
        </Link>
        <Navbar.Toggle />
        <Navbar.Offcanvas placement="end" style={{ width: '300px' }}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              <Link href="/">
                <Image
                  className={styles.main_logo}
                  src="/row_logo.png"
                  alt="세차새차"
                  width={146}
                  height={40}
                  priority
                />
              </Link>
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className={styles.nav_item}>
              {user?.isLogined ? (
                <>
                  <Nav.Link onClick={handleLogoutClick}>로그아웃</Nav.Link>
                </>
              ) : (
                <>
                  <Link href="/auth/login" legacyBehavior passHref>
                    <Nav.Link>로그인</Nav.Link>
                  </Link>
                  <Link href="/auth/signup" legacyBehavior passHref>
                    <Nav.Link>회원가입</Nav.Link>
                  </Link>
                </>
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}
