import { UserInfo } from 'firebase';

export interface UserStateModel {
  user: UserDetail;
  loaded: boolean;
}

export interface UserDetail {
    fullName: string;
    uid: string;
    pictureURL?: RoutePicture;
    email: string;
    lastSignInTime?: string;
    listOfItems?: Array<ItemOfUser>;
  }
  
  
  export interface UserUpdate {
    firsName: string;
    lastName: string;
    uuid: string;
    pictureURL: RoutePictureToUpdate;
    email: string;
  }
  export interface RoutePicture {
    pathOfBucket: string;
    pathOfImage: string;
  }
  export interface RoutePictureToUpdate {
    pathOfBucketOld: string;
    base64Image: string;
  }
  
  export interface ItemOfUser {
    uuid: string,
    isSold: boolean,
    price: number,
    profileItem: string,
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