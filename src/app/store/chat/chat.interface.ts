import { Product } from '../product';

export interface ChatStateModel {
  messages?: Product[];
  loaded: boolean;
}
