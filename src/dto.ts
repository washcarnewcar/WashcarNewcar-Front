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

export interface MenuListDto {
  number: number;
  image: string;
  name: string;
  description: string;
  price: number;
}

export interface MenuDto {
  image: string;
  name: string;
  description: string;
  price: number;
  expected_hour: number;
  expected_minute: number;
}

export interface TimeDto {
  sunday: {
    start: string;
    end: string;
  } | null;
  monday: {
    start: string;
    end: string;
  } | null;
  tuesday: {
    start: string;
    end: string;
  } | null;
  wednesday: {
    start: string;
    end: string;
  } | null;
  thursday: {
    start: string;
    end: string;
  } | null;
  friday: {
    start: string;
    end: string;
  } | null;
  saturday: {
    start: string;
    end: string;
  } | null;
}

export interface ExceptDto {
  allday: boolean;
  start: string;
  end: string;
  error: string;
}
