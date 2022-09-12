// import Card from './Card';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from './CardGrid.module.scss';

interface CardProps {
  type: string;
}

const CardGrid = () => {
  return (
    <div className={styles.card_grid}>
      <Card type="세차하기" />
      <Card type="예약하기" />
      <Card type="등록하기" />
    </div>
  );
};

const Card = ({ type }: CardProps) => {
  const [card, setCard] = useState(<></>);

  useEffect(() => {
    setCard(selectCard(type));
  }, [type]);

  const selectCard = (type: string) => {
    switch (type) {
      case '세차하기':
        return (
          <Link to="/search" className={styles.card_grid_item}>
            <div className={styles.card_title}>세차하기</div>
            <div className={styles.card_content}>내 주변 세차장 찾기</div>
          </Link>
        );
      case '예약하기':
        return (
          <Link to="/reservation" className={styles.card_grid_item}>
            <div className={styles.card_title}>예약하기</div>
            <div className={styles.card_content}>내 주변 세차장 찾기</div>
          </Link>
        );
      case '등록하기':
        return (
          <Link to="/provider" className={styles.card_grid_item}>
            <div className={styles.card_title}>등록하기</div>
            <div className={styles.card_content}>세차장 사장님이신가요?</div>
          </Link>
        );
      default:
        return <></>;
    }
  };

  return card ? card : <></>;
};

export default CardGrid;
