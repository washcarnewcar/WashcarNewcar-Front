import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Seperator from '../../components/Seperator';
import MenuItem from './MenuItem';
import styles from './Store.module.scss';

function Store() {
  const { slug } = useParams<{ slug: string }>();

  function onTabClick(event: React.MouseEvent) {}

  return (
    <>
      <Header type={1} />
      <div className={styles.store_image}>
        <div className={styles.image_container}>
          <img
            className={styles.image}
            src="/sample_store_image.png"
            alt="sample"
          />
        </div>
        <div className={styles.image_container}>
          <img
            className={styles.image}
            src="/sample_store_image.png"
            alt="sample"
          />
        </div>
        <div className={styles.image_container}>
          <img
            className={styles.image}
            src="/kakao_login_large_wide.png"
            alt="sample"
          />
        </div>
      </div>

      <div className={styles.store_info}>
        <img
          className={styles.preview_image}
          src="/style_carcare.jpg"
          alt="테스트"
        />
        <div className={styles.content}>
          <div className={styles.store_name}>스타일카케어</div>
        </div>
      </div>

      <Tabs
        defaultActiveKey="wash"
        className={styles.tabs}
        justify
        onClick={onTabClick}
      >
        <Tab eventKey="wash" title="세차" className={styles.tab}>
          <MenuItem />
          <Seperator />
          <MenuItem />
          <Seperator />
          <MenuItem />
          <Seperator />
          <MenuItem />
        </Tab>

        <Tab eventKey="info" title="정보" className={styles.tab}>
          asdfsda
        </Tab>
        <Tab
          eventKey="review"
          title="리뷰"
          className={styles.tab}
          disabled
        ></Tab>
      </Tabs>
    </>
  );
}

export default Store;
