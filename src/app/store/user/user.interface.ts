import { UserInfo } from 'firebase';
import { ShortProduct } from '../product';

export interface UserStateModel {
  user: UserDetail;
  loaded: boolean;
}

export interface UserDetail {
    fullName: string;
    uid: string;
    avatar?: Avatar;
    email: string;
    lastSignInTime?: string;
    phone?: number;
    localization?: string;
    myProducts?: Array<ShortProduct>;
    favorits?: Array<ShortProduct>;
  }
  
  export interface UserUpdate {
    fullName?: string;
    products?: Array<ProductsUser>;
    avatar?: AvatarUpdate;
    favorits?: Array<ProductsUser>;
    phone?: number;
    localization?: string;
  }

  export interface Avatar {
    path: string;
    downloadUrl: string;
  }
  export interface AvatarUpdate {
    path: string;
    base64image: string;
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

  export type User = UserInfo;

  export interface AuthStateModel {
    user?: UserInfo;
  }