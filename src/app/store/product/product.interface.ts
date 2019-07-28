import { Avatar, UserShortInfo } from '../user/user.interface';

export interface ProductStateModel {
  isUserProduct: boolean;
  product: Product;
  loaded: boolean;
}
export interface Product {
  name: string;
  price: number;
  description: string;
  category: any;
  currency: 'DZD' | 'EUR';
  gallery?: Gallery[] | CreateGallery[];
  isEnabled: boolean;
  isSold?: boolean;
  timestamp: number;
  thumbnail?: string;
  user?: UserShortInfo;
  uid?: string;
}

export interface ShortProduct {
  name: string;
  uid: string;
  price: number;
  currency: 'DZD' | 'EUR';
  isEnabled: boolean;
  isSold?: boolean;
  thumbnail: string;
}

export interface Gallery {
  patch: string;
  downloadUrl: string;
}

export interface CreateGallery {
  patch: string;
  base64: string;
}
