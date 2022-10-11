// import Card from './Card';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from './CardGrid.module.scss';

interface CardProps {
  type: string;
}

function CardGrid() {
  return (
    <div className={styles.card_grid}>
      <Link to="/search" className={styles.card_grid_item}>
        <div className={styles.card_title}>세차하기</div>
        <div className={styles.card_content}>내 주변 세차장 찾기</div>
      </Link>
      <Link to="/reservation" className={styles.card_grid_item}>
        <div className={styles.card_content}>QR코드 스캔하고</div>
        <div className={styles.card_title}>예약하기</div>
      </Link>
      <Link to="/provider" className={styles.card_grid_item}>
        <div className={styles.card_title}>매장 관리하기</div>
        <div className={styles.card_content}>세차장 사장님이신가요?</div>
      </Link>
    </div>
  );
}

export default CardGrid;
