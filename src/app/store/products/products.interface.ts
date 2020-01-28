import { Product } from '../product';
import { LoadingState } from 'src/app/interfaces/common.interface';

export interface ProductsStateModel extends LoadingState {
  products?: Product[];
}
