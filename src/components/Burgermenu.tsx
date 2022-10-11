import styles from './Burgermenu.module.scss';
import { useContext } from 'react';
import IsBurgermenuOpenContext from '../contexts/burgermenu';

function Burgermenu() {
  const width = 250;
  const { isOpen, setIsOpen } = useContext(IsBurgermenuOpenContext);

  const onClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.overlay}
        style={{
          opacity: isOpen ? '20%' : '0%',
          pointerEvents: isOpen ? 'all' : 'none',
        }}
        onClick={onClick}
      ></div>
      <div
        className={styles.menu}
        style={{
          right: isOpen ? 0 : -width,
          width: width,
        }}
      >
        <button onClick={onClick}>X</button>
      </div>
    </div>
  );
}

export default Burgermenu;
