
export interface ProductStateModel {
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
  gallery?: Gallery[];
  isEnabled: boolean;
  isSold?: boolean;
  timestamp: Date;

}

export interface Gallery {
  patch: string;
  downloadUrl: string;
}
