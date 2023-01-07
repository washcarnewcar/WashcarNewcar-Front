import { AxiosError } from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Carousel, Container, ListGroup, Placeholder, Tab, Tabs } from 'react-bootstrap';
import { IoCallOutline, IoInformationCircleOutline, IoLocationOutline, IoNavigateOutline } from 'react-icons/io5';
import Header from '../../../src/components/Header';
import TempImage from '../../../src/components/TempImage';
import { MenuListDto, StoreDto } from '../../../src/dto';
import { client } from '../../../src/function/request';

export default function Store() {
  const router = useRouter();
  const { slug } = router.query;
  const [storeInfo, setStoreInfo] = useState<StoreDto>();
  const [menuList, setMenuList] = useState<MenuListDto[] | null[]>([null, null, null]);

  useEffect(() => {
    if (!router.isReady) return;

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
  }, [router.isReady]);

  return (
    <>
      <Head>
        <title>세차새차 - {storeInfo ? storeInfo.name : '매장 정보'}</title>
      </Head>
      <Header />

      <Container className="p-0">
        <Carousel>
          {storeInfo?.store_image.map((storeImage, index) => (
            <Carousel.Item className="text-center" style={{ height: 300 }} key={index}>
              <Image style={{ objectFit: 'cover' }} src={process.env.NEXT_PUBLIC_S3_URL + storeImage} alt="" fill />
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
      <Container>
        {/* storeInfo가 없을 땐 placeholder 표시 */}
        {storeInfo ? (
          <div className="d-flex align-items-center m-3">
            <div
              className="d-flex justify-content-center align-items-center rounded-3 overflow-hidden bg-secondary bg-opacity-25"
              style={{ width: 60, height: 60 }}
            >
              {/* preview_image가 없을 땐 임시 이미지 표시 */}
              {storeInfo.preview_image ? (
                <Image
                  style={{ objectFit: 'cover' }}
                  width={60}
                  height={60}
                  src={process.env.NEXT_PUBLIC_S3_URL + storeInfo.preview_image}
                  alt=""
                />
              ) : (
                <TempImage width={50} height={50} />
              )}
            </div>
            <div className="ms-3 fw-bold fs-3">{storeInfo.name}</div>
          </div>
        ) : (
          <Placeholder className="d-flex align-items-center m-3" animation="glow">
            <Placeholder
              className="d-flex justify-content-center align-items-center rounded-3 overflow-hidden"
              style={{ height: 60, width: 60 }}
            />
            <Placeholder className="ms-3 fw-bold fs-3" style={{ width: 100 }} />
          </Placeholder>
        )}

        <Tabs defaultActiveKey="wash" justify id="tabs">
          <Tab eventKey="wash" title="세차">
            <ListGroup variant="flush">
              {menuList?.map((menuItem, index) => (
                <MenuItem data={menuItem} key={index} />
              ))}
            </ListGroup>
          </Tab>

          <Tab eventKey="info" title="정보">
            <ListGroup variant="flush">
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
            </ListGroup>
          </Tab>
        </Tabs>
      </Container>
    </>
  );
}

interface InfoItemProps {
  type: string;
  data: string | undefined;
}

function InfoItem({ type, data }: InfoItemProps) {
  // 데이터가 없으면 표시하지 않음
  if (data === '' || data === null) {
    return null;
  }

  let icon = null;
  // 유형에 따라 아이콘 표시
  switch (type) {
    case 'tel':
      icon = <IoCallOutline size={20} color="gray" />;
      break;
    case 'address':
      icon = <IoLocationOutline size={20} color="gray" />;
      break;
    case 'wayto':
      icon = <IoNavigateOutline size={20} color="gray" />;
      break;
    case 'information':
      icon = <IoInformationCircleOutline size={20} color="gray" />;
      break;
    default:
      console.error('잘못된 info 타입');
      return null;
  }

  return (
    <ListGroup.Item className="p-2">
      <table>
        <tbody>
          <tr>
            <td>{data !== undefined ? icon : <Placeholder className="rounded tw-w-[20px] tw-h-[20px]" />}</td>
            <td className="ps-3">{data !== undefined ? data : <Placeholder className="w-100" />}</td>
          </tr>
        </tbody>
      </table>
    </ListGroup.Item>
  );
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
      <Placeholder as={ListGroup.Item} className="p-3" animation="glow">
        <div className="d-flex align-items-center">
          <Placeholder className="flex-shrink-0 rounded tw-w-[100px] tw-h-[100px]" />
          <div className="ms-3 d-flex flex-column justify-content-between w-100 tw-min-h-[100px]">
            <div>
              <Placeholder className="fs-3 w-100" />
              <Placeholder className="w-100" />
            </div>
            <Placeholder className="w-100" />
          </div>
        </div>
      </Placeholder>
    );
  }

  return (
    <ListGroup.Item action className="p-3">
      <Link
        href={`/store/${slug}/menu/${data.number}`}
        className="d-flex align-items-center text-decoration-none text-black"
      >
        <div className="d-flex flex-shrink-0 tw-w-px-100 tw-w-[100px] tw-h-[100px]">
          <Image
            width={100}
            height={100}
            className="rounded"
            style={{ objectFit: 'cover' }}
            src="/style_carcare.jpg"
            alt="menu_image"
          />
        </div>
        <div className="ms-3 d-flex flex-column justify-content-between tw-min-h-[100px]">
          <div>
            <div className="fs-3 fw-bold">{data.name}</div>
            <div>{data.description}</div>
          </div>
          <div className="fw-bold">{data.price.toLocaleString()}원</div>
        </div>
      </Link>
    </ListGroup.Item>
  );
}
