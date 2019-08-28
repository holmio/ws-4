
export interface ChatStateModel {
  loaded: boolean;
  channel: Channel;
  channels: Channel[];
}

export interface Channel {
  uid: string;
  product: Product;
  visitor: User;
  owner: User;
  timestamp: number;
  createdAt: number;
  lastMessage: string;
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
  avatar: string;
  lastConnection: number;
}
export interface Message {
  uid: string;
  timestamp: number;
  message: string;
}

interface MembersEntity {
  [key: string]: boolean;
}
