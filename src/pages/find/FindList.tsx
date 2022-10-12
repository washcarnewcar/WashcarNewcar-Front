import { useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import styles from './FindList.module.scss';

function FindList() {
  const { phone } = useParams();

  return (
    <>
      <Header type={1} />
      <div className={styles.container}>
        <div className={styles.title}>예약한 세차</div>
        <ListGroup>
          <ListGroup.Item>Hello</ListGroup.Item>
          <ListGroup.Item>There</ListGroup.Item>
          <ListGroup.Item>Nice</ListGroup.Item>
          <ListGroup.Item>To</ListGroup.Item>
          <ListGroup.Item>Meet you!</ListGroup.Item>
        </ListGroup>
      </div>
    </>
  );
}
export default FindList;
