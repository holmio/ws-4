import { Product } from '../product/product.interface';

// GETTING PRODUCT
export class GetProductsAction {
  static type = '[Products] GetProducts';
}

export class GetMoreProductsAction {
  static type = '[Products] GetMoreProducts';
  constructor(public limit: number) { }
}
export class GetProductsSuccessAction {
  static type = '[Products] GetProductsSuccess';
  constructor(public products: Product[]) { }
}
export class GetProductsFailedAction {
  static type = '[Products] GetProductsFailed';
  constructor(public error: any) { }
}
