import { Product } from '../product';

export interface ProductsStateModel {
  products?: Product[];
  loaded: boolean;
}
