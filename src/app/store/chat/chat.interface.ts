import { Product } from '../product';

export interface ChatStateModel {
  chat: Chat;
  loaded: boolean;
  chatsDetail: ChatDetail[];
}

export interface Chat {
  uid: string;
  uidProduct: string;
  productName: string;
  uidUser: string;
  userAvatar: string;
  createdAt: number;
  messages?: Message[];
  thumbnail?: string;
  members: MembersEntity;
}

export interface ChatDetail {
  uid: string;
  thumbnail: string;
  productName: string;
  timestamp: number;
  message: string;
  members: MembersEntity;
}
export interface Message {
  uid: string;
  timestamp: number;
  message: string;
}

export interface MembersEntity {
  [key: string]: boolean;
}
