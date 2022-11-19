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
