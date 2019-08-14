import { UserInfo } from 'firebase';
import { ShortProduct, Product } from '../product';

export interface UserStateModel {
  user: User;
  loaded: boolean;
}

export interface User {
    name: string;
    uid: string;
    avatar?: string;
    email: string;
    lastSignInTime?: string;
    phone?: number;
    localization?: string;
    myProducts?: Product[];
    favorites?: Product[];
    willaya?: string;
    daira?: string;
  }
  
  export interface ProductsUser {
    uid: string,
    isSold: boolean,
    price: number,
    avatar: string,
    currency: string,
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
    uid: string;
  }