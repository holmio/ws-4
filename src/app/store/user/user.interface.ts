import { UserInfo } from 'firebase';
import { Product } from '../product';

export interface UserStateModel {
  user: User;
  myProducts: Product[];
  favoriteProducts: Product[];
  visitedUser: VisitedUser;
  loaded: boolean;
}
export interface VisitedUser {
  user: User;
  products: Product[];
  favorites: Product[];
}
export interface User {
  name: string;
  uid: string;
  avatar?: string;
  email: string;
  phone?: number;
  myProducts?: Product[];
  favorites?: Product[];
  willaya?: string;
  lastConnection?: number;
  daira?: string;
}

export interface ProductsUser {
  uid: string;
  isSold: boolean;
  price: number;
  avatar: string;
  currency: string;
}

export interface LoginWithEmailAndPassword {
  email: string;
  password: string;
}

export interface AuthStateModel {
  user?: UserInfo;
}

export interface UserShortInfo {
  name?: string;
  avatar?: string;
  lastConnection?: number;
  uid: string;
}
