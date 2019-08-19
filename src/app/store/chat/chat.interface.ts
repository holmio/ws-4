import { Product } from '../product';

export interface ChatStateModel {
  chat: Chat;
  loaded: boolean;
}

export interface Chat {
  uid: string;
  uidOwner: string;
  uidVisitor: string;
  uidProduct: string;
  productName: string;
  ownerAvatar: string;
  createdAt: number;
  messages?: Message[];
}
export interface Message {
  uid: string;
  timestamp: number;
  message: string;
}
