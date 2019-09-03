import { Product } from '../product';

export interface SearchStateModel {
  products: Product[];
  loaded: boolean;
  loading: boolean;
}
export interface Filter {
  name: string;
}
