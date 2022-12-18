import React, { useEffect, useState } from 'react';
import { Carousel, Placeholder, Tab, Tabs } from 'react-bootstrap';
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
import axios, { AxiosError } from 'axios';
import { MenuListDto, StoreDto } from '../../../src/dto';
import { client } from '../../../src/function/request';
import Loading from '../../../src/components/Loading';

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
  const [storeInfo, setStoreInfo] = useState<StoreDto>();
  const [menuList, setMenuList] = useState<MenuListDto[] | null[]>([
    null,
    null,
    null,
  ]);

  useEffect(() => {
    const getStoreInfo = async () => {
      try {
        const response = await client.get(`/store/${slug}/info`);
        const data: StoreDto = response?.data;
        console.debug(`GET /store/${slug}/info`, data);
        setStoreInfo(data);
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          alert('해당 주소의 세차장이 없습니다.');
          router.replace('/');
        } else {
          throw error;
        }
      }
    };

    const getMenuList = async () => {
      try {
        const response = await client.get(`/store/${slug}/menu`);
        const data: MenuListDto[] = response?.data?.menu;
        console.debug(`GET /store/${slug}/menu`, data);
        setMenuList(data);
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          alert('해당 주소의 세차장이 없습니다.');
          router.replace('/');
        } else {
          throw error;
        }
      }
    };

    if (slug) {
      getStoreInfo();
      getMenuList();
    }
  }, [slug]);

  return (
    <>
      <Header type={1} />
      <Carousel>
        {storeInfo?.store_image.map((storeImage, index) => (
          <Carousel.Item className={styles.carousel_item} key={index}>
            <Image
              width={350}
              height={200}
              className={styles.image}
              src={process.env.NEXT_PUBLIC_S3_URL + storeImage}
              alt="매장사진"
            />
          </Carousel.Item>
        ))}
      </Carousel>

      {storeInfo ? (
        <div className={styles.store_info}>
          <Image
            className={styles.preview_image}
            width={60}
            height={60}
            src={process.env.NEXT_PUBLIC_S3_URL + storeInfo.preview_image}
            alt=""
          />
          <div className={styles.content}>
            <div className={styles.store_name}>{storeInfo.name}</div>
          </div>
        </div>
      ) : (
        <Placeholder className={styles.store_info} animation="glow">
          <Placeholder className={styles.preview_image} />
          <div className={styles.content}>
            <Placeholder
              style={{ width: '100px' }}
              className={styles.store_name}
            />
          </div>
        </Placeholder>
      )}

      <Tabs defaultActiveKey="wash" className={styles.tabs} justify id="tabs">
        <Tab eventKey="wash" title="세차" tabClassName={styles.tab}>
          {menuList.map((menuItem, index) => (
            <div key={index}>
              <MenuItem data={menuItem} />
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

interface MenuItemProps {
  data: MenuListDto | null;
}

function MenuItem({ data }: MenuItemProps) {
  const router = useRouter();
  const { slug } = router.query;

  // Placeholder
  if (!data) {
    return (
      <Placeholder className={styles.link} animation="glow">
        <div className={styles.container}>
          <div className={styles.image_wrapper}>
            <Placeholder
              style={{ width: 90, height: 90 }}
              className={styles.image}
            />
          </div>
          <div className={styles.content}>
            <div className={styles.menu_title_description}>
              <Placeholder
                style={{ width: 90 }}
                className={styles.menu_title}
              />
              <Placeholder
                style={{ width: 90 }}
                className={styles.menu_description}
              />
            </div>
            <Placeholder style={{ width: 90 }} className={styles.menu_price} />
          </div>
        </div>
      </Placeholder>
    );
  }

  return (
    <Link href={`/store/${slug}/menu/${data.number}`}>
      <a className={styles.link}>
        <div className={styles.container}>
          <div className={styles.image_wrapper}>
            <Image
              width={100}
              height={100}
              className={styles.image}
              src="/style_carcare.jpg"
              alt="menu_image"
            />
          </div>
          <div className={styles.content}>
            <div className={styles.menu_title_description}>
              <div className={styles.menu_title}>{data.name}</div>
              <div className={styles.menu_description}>{data.description}</div>
            </div>
            <div className={styles.menu_price}>
              {data.price.toLocaleString()}원
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}
