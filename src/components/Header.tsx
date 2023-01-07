import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import UserContext from '../context/UserProvider';
import { authClient } from '../function/request';

export default function Header() {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);

  const handleLogoutClick = async () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      await authClient.get('/logout');
      setUser({ isLogined: false });
      router.replace('/');
    }
  };

  return (
    <Navbar sticky="top" bg="white" expand="sm" className="shadow-sm" id="navbar">
      <Container>
        <Link href="/" className="flex">
          <Image src="/row_logo.png" alt="세차새차" width={146} height={40} priority />
        </Link>
        <Navbar.Toggle />
        <Navbar.Offcanvas placement="end" className="w-75">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              <Link href="/">
                <Image src="/row_logo.png" alt="세차새차" width={146} height={40} priority />
              </Link>
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="w-100 justify-content-end">
              {user === null ? (
                <BeatLoader color="lightGray" />
              ) : user.isLogined ? (
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
