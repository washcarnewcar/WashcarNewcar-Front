export interface StoreDto {
  name: string;
  tel: string;
  coordinate: CoordinateDto;
  address: string;
  address_detail: string;
  slug: string;
  wayto: string;
  description: string;
  preview_image: string;
  store_image: string[];
}

export interface CoordinateDto {
  longitude: number;
  latitude: number;
}

export interface RequestDto {
  reservation_number: number;
  menu: string;
  car_number: string;
  car_model: string;
  date: Date;
}

export interface ScheduleDto extends RequestDto {}

export interface MenuDto {
  number: number;
  image: string;
  name: string;
  description: string;
  price: number;
}
