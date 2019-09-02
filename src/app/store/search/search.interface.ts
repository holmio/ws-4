import { Product } from '../product';

export interface SearchStateModel {
  products?: Product[];
  loaded: boolean;
}
export interface Filter {
  name: string;
}
