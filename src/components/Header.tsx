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
  // const { isOpen, setIsOpen } = useContext(IsBurgermenuOpenContext);
  // const onClick = () => {
  //   setIsOpen(!isOpen);
  // };

  if (type === 1) {
    return (
      // <div className={styles.container}>
      //   <div className={styles.left}>
      //     <Link to="/">
      //       <img className={styles.main_logo} src="메인로고.png" alt="로고" />
      //     </Link>
      //   </div>
      //   <div className={styles.center}>
      //     <Link to="/">
      //       <img className={styles.text_logo} src="세차새차.png" alt="세차새차" />
      //     </Link>
      //   </div>
      //   <div className={styles.right}>
      //     <button className={styles.menubutton} onClick={onClick}>
      //       <FiMenu color="#2964F6" strokeWidth={3} size={'100%'} />
      //     </button>
      //   </div>
      // </div>
      <Navbar sticky="top" bg="white" expand={false} id={styles.container}>
        <Container>
          <Link to={'/'}>
            <Navbar.Brand>
              <img className={styles.main_logo} src="메인로고.png" alt="로고" />
              <img
                className={styles.text_logo}
                src="세차새차.png"
                alt="세차새차"
              />
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
