
export interface ChatStateModel {
  chat: Chat;
  loaded: boolean;
  chatsDetail: ChatDetail[];
}

export interface Chat {
  uid: string;
  uidProduct: string;
  uidUser: string;
  createdAt: number;
  messages: Message[];
}

export interface ChatDetail {
  uid: string;
  product: Product,
  visitor: User,
  owner: User,
  timestamp: number;
  message: string;
  members: MembersEntity;
}
interface Product {
  name: string;
  avatar: string;
  uid: string;
}
interface User {
  name: string;
  uid: string;
  avatar: string
  lastConnection: number
}
export interface Message {
  uid: string;
  timestamp: number;
  message: string;
}

interface MembersEntity {
  [key: string]: boolean;
}
