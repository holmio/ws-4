import { UserInfo } from 'firebase';

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
    products?: Array<ProductsUser>;
    favorits?: Array<ProductsUser>;
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