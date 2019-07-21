
export interface ProductStateModel {
  isUserProduct: boolean;
  product: Product;
  loaded: boolean;
}
export interface Product {
  name: string;
  price: number;
  uidUser: string;
  description: string;
  category: any;
  currency: 'DZD' | 'EUR';
  gallery?: Gallery[] | CreateGallery[];
  isEnabled: boolean;
  isSold?: boolean;
  timestamp: number;
  thumbnail?: string;
  uid: string;
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
