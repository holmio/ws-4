import { Product } from '../product';

export interface ProductsStateModel {
  products?: Product[];
  myProducts: Product[];
  favoriteProducts: Product[];
  loaded: boolean;
}
