import { AxiosError } from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Carousel, Placeholder, Tab, Tabs } from 'react-bootstrap';
import {
  IoCallOutline,
  IoInformationCircleOutline,
  IoLocationOutline,
  IoNavigateOutline,
} from 'react-icons/io5';
import Header from '../../../src/components/Header';
import Seperator from '../../../src/components/Seperator';
import { MenuListDto, StoreDto } from '../../../src/dto';
import { client } from '../../../src/function/request';
import styles from '../../../styles/Store.module.scss';

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
        {storeInfo?.store_image
          ? storeInfo?.store_image.map((storeImage, index) => (
              <Carousel.Item className={styles.carousel_item} key={index}>
                <Image
                  className={styles.carousel_image}
                  src={process.env.NEXT_PUBLIC_S3_URL + storeImage}
                  alt="매장사진"
                  layout="fill"
                />
              </Carousel.Item>
            ))
          : null}
      </Carousel>

      {storeInfo ? (
        <div className={styles.title}>
          <Image
            className={styles.title_image}
            width={60}
            height={60}
            src={process.env.NEXT_PUBLIC_S3_URL + storeInfo.preview_image}
            alt=""
          />
          <div className={styles.title_content}>
            <div className={styles.title_name}>{storeInfo.name}</div>
          </div>
        </div>
      ) : (
        <Placeholder className={styles.title} animation="glow">
          <Placeholder className={styles.title_image} />
          <div className={styles.title_content}>
            <Placeholder
              style={{ width: '100px' }}
              className={styles.title_name}
            />
          </div>
        </Placeholder>
      )}

      <Tabs defaultActiveKey="wash" className={styles.tabs} justify id="tabs">
        <Tab eventKey="wash" title="세차" tabClassName={styles.tab}>
          {menuList?.map((menuItem, index) => (
            <div key={index}>
              <MenuItem data={menuItem} />
              <Seperator />
            </div>
          ))}
        </Tab>

        <Tab eventKey="info" title="정보" tabClassName={styles.tab}>
          <InfoItem type="tel" data={storeInfo?.tel} />
          <InfoItem
            type="address"
            data={
              storeInfo?.address || storeInfo?.address_detail
                ? `${storeInfo?.address} ${storeInfo?.address_detail}`
                : undefined
            }
          />
          <InfoItem type="wayto" data={storeInfo?.wayto} />
          <InfoItem type="information" data={storeInfo?.description} />
        </Tab>
      </Tabs>
    </>
  );
}

interface InfoItemProps {
  type: string;
  data: string | undefined;
}

function InfoItem({ type, data }: InfoItemProps) {
  // placeholder
  if (data === undefined) {
    return (
      <>
        <Placeholder className={styles.info_flex} animation="glow">
          <div className={styles.icon}>
            <Placeholder
              style={{ width: '20px', height: '20px', borderRadius: '4px' }}
            />
          </div>
          <div className={styles.info_content}>
            <Placeholder style={{ width: '150px' }} />
          </div>
        </Placeholder>
        <Seperator />
      </>
    );
  }

  // 데이터가 없으면 표시하지 않음
  if (data === '' || data === null) {
    return null;
  }

  // 유형에 따라 정보 표시
  switch (type) {
    case 'tel':
      return (
        <>
          <div className={styles.info_flex}>
            <IoCallOutline className={styles.icon} size={20} color="gray" />
            <div className={styles.info_content}>{data}</div>
          </div>
          <Seperator />
        </>
      );
    case 'address':
      return (
        <>
          <div className={styles.info_flex}>
            <IoLocationOutline className={styles.icon} size={20} color="gray" />
            <div className={styles.info_content}>{data}</div>
          </div>
          <Seperator />
        </>
      );
    case 'wayto':
      return (
        <>
          <div className={styles.info_flex}>
            <IoNavigateOutline className={styles.icon} size={20} color="gray" />
            <div className={styles.info_content}>{data}</div>
          </div>
          <Seperator />
        </>
      );
    case 'information':
      return (
        <>
          <div className={styles.info_flex}>
            <IoInformationCircleOutline
              className={styles.icon}
              size={20}
              color="gray"
            />
            <div className={styles.info_content}>{data}</div>
          </div>
          <Seperator />
        </>
      );
    default:
      throw new Error('잘못된 info 타입');
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
              style={{ width: 100, height: 100 }}
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
                style={{ width: 90, marginTop: 10 }}
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
    <Link href={`/store/${slug}/menu/${data.number}`} className={styles.link}>
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
    </Link>
  );
}
