import { Product } from '../product';
import { Filter } from './search.interface';

// GETTING PRODUCT
export class GetSearchAction {
  static type = '[Search] GetSearch';
  constructor(public filter: Filter) { }
}
export class GetSearchSuccessAction {
  static type = '[Search] GetSearchSuccess';
  constructor(public products: Product[]) { }
}
export class GetSearchFailedAction {
  static type = '[Search] GetSearchFailed';
  constructor(public error: any) { }
}
