import { FiMenu } from 'react-icons/fi';
import styles from './Header.module.scss';
import { useContext } from 'react';
import IsBurgermenuOpenContext from '../contexts/burgermenu';
import { Link } from 'react-router-dom';
import {
  Col,
  Container,
  Nav,
  Navbar,
  Offcanvas,
  OffcanvasHeader,
  Row,
} from 'react-bootstrap';

interface HeaderProps {
  type: number;
}

const Header = ({ type }: HeaderProps) => {
  if (type === 1) {
    return (
      <Navbar sticky="top" bg="white" expand={false} id={styles.container}>
        <Container>
          <Link to={'/'} style={{ textDecoration: 'none' }}>
            <Navbar.Brand>
              <img
                className={styles.main_logo}
                src="main_logo.png"
                alt="로고"
              />
              <span className={styles.text_logo}>세차새차</span>
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle />
          <Navbar.Offcanvas placement="end" style={{ width: '300px' }}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>세차새차</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
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
          <Link to={'/'}>
            <Navbar.Brand>
              <img
                className={styles.text_logo}
                src="carwash.png"
                alt="세차새차"
              />
              <img className={styles.main_logo} src="메인로고.png" alt="로고" />
            </Navbar.Brand>
          </Link>
        </Container>
      </Navbar>
    );
  }
  return <></>;
};

export default Header;
