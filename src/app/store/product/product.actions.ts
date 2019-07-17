import {Product} from './product.interface';


// Actions
export class GetProductAction {
  static type = '[Product] GetProduct';
  constructor(public uid: string) {}
}
export class GetProductSuccessAction {
  static type = '[Product] GetProductSuccess';
  constructor(public product: Product) {}
}
export class GetProductFailedAction {
  static type = '[Product] GetProductFailed';
  constructor(public error: any) {}
}

export class SetProductAction {
  static type = '[Product] SetProduct';
  constructor(public product: Product) {}
}
export class SetProductSuccessAction {
  static type = '[Product] SetProductSuccess';
  constructor(public uid: string) {}
}
export class SetProductFailedAction {
  static type = '[Product] SetProductFailed';
  constructor(public error: any) {}
}

export class UpdateProductAction {
  static type = '[Product] UpdateProduct';
  constructor(public product: Product) {}
}
export class UpdateProductSuccessAction {
  static type = '[Product] UpdateProductSuccess';
}
export class UpdateProductFailedAction {
  static type = '[Product] UpdateProductFailed';
  constructor(public error: any) {}
}
