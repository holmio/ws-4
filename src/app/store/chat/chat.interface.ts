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
  createdAt: string;
  messages?: Message[];
}
export interface Message {
  uid: string;
  timestamp: string;
  message: string;
}
