import { Product } from './product.interface';


// GETTING
export class GetProductAction {
  static type = '[Product] GetProduct';
  constructor(public uid: string) { }
}
export class GetProductSuccessAction {
  static type = '[Product] GetProductSuccess';
  constructor(public product: Product) { }
}
export class GetProductFailedAction {
  static type = '[Product] GetProductFailed';
  constructor(public error: any) { }
}
// CREATE
export class SetProductAction {
  static type = '[Product] SetProduct';
  constructor(public product: Product) { }
}
export class SetProductSuccessAction {
  static type = '[Product] SetProductSuccess';
  constructor(public uid: string) { }
}
export class SetProductFailedAction {
  static type = '[Product] SetProductFailed';
  constructor(public error: any) { }
}
// UPDATE
export class UpdateProductAction {
  static type = '[Product] UpdateProduct';
  constructor(public product: Product) { }
}
export class UpdateProductSuccessAction {
  static type = '[Product] UpdateProductSuccess';
}
export class UpdateProductFailedAction {
  static type = '[Product] UpdateProductFailed';
  constructor(public error: any) { }
}
// DELETE
export class DeleteProductAction {
  static type = '[Product] DeleteProduct';
}
export class DeleteProductSuccessAction {
  static type = '[Product] DeleteProductSuccess';
}
export class DeleteProductFailedAction {
  static type = '[Product] DeleteProductFailed';
  constructor(public error: any) { }
}

// ADD FAVORITE
export class AddFavoriteAction {
  static type = '[Product] AddFavorite';
  constructor(public uid: string) { }
}
export class AddFavoriteSuccessAction {
  static type = '[Product] AddFavoriteSuccess';
}
export class AddFavoriteFailedAction {
  static type = '[Product] AddFavoriteFailed';
  constructor(public error: any) { }
}
// Remove FAVORITE
export class RemoveFavoriteAction {
  static type = '[Product] RemoveFavorite';
  constructor(public uid: string) { }
}
export class RemoveFavoriteSuccessAction {
  static type = '[Product] RemoveFavoriteSuccess';
}
export class RemoveFavoriteFailedAction {
  static type = '[Product] RemoveFavoriteFailed';
  constructor(public error: any) { }
}

