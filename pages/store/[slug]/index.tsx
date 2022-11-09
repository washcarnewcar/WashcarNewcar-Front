import React, { useEffect } from 'react';
import { Carousel, Tab, Tabs } from 'react-bootstrap';
import Header from '../../../src/components/Header';
import Seperator from '../../../src/components/Seperator';
import styles from '../../../styles/Store.module.scss';
import {
  IoCallOutline,
  IoInformationCircleOutline,
  IoLocationOutline,
  IoNavigateOutline,
} from 'react-icons/io5';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

const tempData = {
  call: '010-2474-6837',
  location: '서울 서초구 반포대로 24길 20 1층',
  wayto: `서초역 1번 출구(교대역 방면)에서 바로 우회전 후
현대 자동차 정비소 끼고 좌회전 하시면
바로 있습니다.`,
  information: `안녕하세요.
스타일카케어 서초직영점입니다

스타일카케어는 강남논현본점을 시작으로 강남역삼점 강 남대치점 서울신윌점 그리고 이번 강남 서초직영점까지 5개의 매장이 함께하고 있는 중견업체입니다.
또한 2021 대한민국 인기브랜드 대상을 수상하며 고객 뿐 아니라 업계에서도 인정받는다는 것을 증명하였습니다.

저희 스타일카케어는 디테일링, 손세차, 유리막코팅, PPF, 사고수리, 썬팅, 카오 디오, 방음 등 차량 관리 토탈 케어샵으로 확실한 시공과 사후 처리까지 완벽하게 진행해드리고 있으며,
전 직원들의 철저한 교육을 통해 꼼꼼하고 확실한 작업을 도와드리고 있습니다.

차량에 관련한 모든 부분 저희 스타일카케어를 통해 진행하신다면 후회 없으실거라 자신합니다.
자세한 문의사항은 010.4465.6111 으로 문의주시면 친절히 답변해드리겠습니다.`,
};

const menuTempData = {
  menu: [
    {
      number: 1,
      image: 'S3 URL',
      name: '외부 세차',
      detail:
        '세차에 대한 설명dfasffsdfsdfdsfs\n두줄 정도 표시할까 ㅇ라넝라너dfsafdsds',
      price: 80000,
    },
    {
      number: 2,
      image: 'S3 URL',
      name: '내부 세차',
      detail: '세차에 대한 설명\n두줄 정도 표시할까 생각중',
      price: 70000,
    },
    {
      number: 3,
      image: 'S3 URL',
      name: '내부 세차',
      detail: '한줄은 어때요?',
      price: 70000,
    },
  ],
};

export default function Store() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <>
      <Header type={1} />
      <Carousel>
        <Carousel.Item className={styles.carousel_item}>
          <Image
            width={350}
            height={200}
            className={styles.image}
            src="/sample_store_image.png"
            alt="sample"
          />
        </Carousel.Item>
        <Carousel.Item className={styles.carousel_item}>
          <Image
            width={350}
            height={200}
            className={styles.image}
            src="/sample_store_image.png"
            alt="sample"
          />
        </Carousel.Item>
        <Carousel.Item className={styles.carousel_item}>
          <Image
            width={350}
            height={200}
            className={styles.image}
            src="/sample_store_image.png"
            alt="sample"
          />
        </Carousel.Item>
      </Carousel>

      <div className={styles.store_info}>
        <Image
          className={styles.preview_image}
          width={60}
          height={60}
          src="/style_carcare.jpg"
          alt="테스트"
        />
        <div className={styles.content}>
          <div className={styles.store_name}>스타일카케어</div>
        </div>
      </div>

      <Tabs defaultActiveKey="wash" className={styles.tabs} justify id="tabs">
        <Tab eventKey="wash" title="세차" tabClassName={styles.tab}>
          {menuTempData.menu.map((menuItem, index) => (
            <div key={index}>
              <MenuItem slug={slug as string} data={menuItem} />
              <Seperator />
            </div>
          ))}
        </Tab>

        <Tab eventKey="info" title="정보" tabClassName={styles.tab}>
          <InfoItem type="call" data={tempData.call} />
          <Seperator />
          <InfoItem type="location" data={tempData.location} />
          <Seperator />
          <InfoItem type="wayto" data={tempData.wayto} />
          <Seperator />
          <InfoItem type="information" data={tempData.information} />
        </Tab>
      </Tabs>
    </>
  );
}

interface InfoItemProps {
  type: string;
  data: string;
}

function InfoItem({ type, data }: InfoItemProps) {
  switch (type) {
    case 'call':
      return (
        <div className={styles.info_flex}>
          <div className={styles.icon}>
            <IoCallOutline className={styles.icon} size={20} color="gray" />
          </div>
          <div className={styles.info_content}>{data}</div>
        </div>
      );
    case 'location':
      return (
        <div className={styles.info_flex}>
          <div className={styles.icon}>
            <IoLocationOutline className={styles.icon} size={20} color="gray" />
          </div>
          <div className={styles.info_content}>{data}</div>
        </div>
      );
    case 'wayto':
      return (
        <div className={styles.info_flex}>
          <div className={styles.icon}>
            <IoNavigateOutline size={20} color="gray" />
          </div>
          <div className={styles.info_content}>{data}</div>
        </div>
      );
    case 'information':
      return (
        <div className={styles.info_flex}>
          <div className={styles.icon}>
            <IoInformationCircleOutline size={20} color="gray" />
          </div>
          <div className={styles.info_content}>{data}</div>
        </div>
      );
    default:
      return (
        <>
          {type}
          {data}
        </>
      );
  }
}

interface IData {
  image: string;
  name: string;
  detail: string;
  price: number;
  number: number;
}

interface MenuItemProps {
  data: IData;
  slug: string;
}

function MenuItem({ slug, data }: MenuItemProps) {
  return (
    <Link href={`/store/${slug}/menu/${data.number}`}>
      <a className={styles.link}>
        <div className={styles.container}>
          <div className={styles.image_wrapper}>
            <Image
              width={90}
              height={90}
              className={styles.image}
              src="/style_carcare.jpg"
              alt="menu_image"
            />
          </div>
          <div className={styles.content}>
            <div className={styles.menu_title}>{data.name}</div>
            <div className={styles.menu_detail}>{data.detail}</div>
            <div className={styles.menu_price}>
              {data.price.toLocaleString()}원
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}
