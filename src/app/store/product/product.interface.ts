import { UserShortInfo } from '../user';

export interface ProductStateModel {
  isUserProduct: boolean;
  isFavorite: boolean;
  product: Product;
  userInfo: UserShortInfo;
  loaded: boolean;
}

export interface ProductsStateModel {
  products: Product;
  loaded: boolean;
}
export interface Product {
  name: string;
  price: number;
  description: string;
  category: string;
  currency: 'DZD' | 'EUR';
  gallery?: string[];
  followers?: Array<string>;
  isEnabled: boolean;
  isSold?: boolean;
  timestamp: number;
  creationDate?: number;
  avatar?: string;
  userUid: string;
  uid?: string;
  willaya?: string;
  daira?: string;
}

export interface ShortProduct {
  name: string;
  uid: string;
  price: number;
  currency: 'DZD' | 'EUR';
  isEnabled: boolean;
  followers?: Array<string>;
  isSold?: boolean;
  avatar: string;
}

export interface Gallery {
  patch: string;
  downloadUrl: string;
}

export interface CreateGallery {
  base64: string;
}
