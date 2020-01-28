import { Action, Selector, State, StateContext, Store } from '@ngxs/store';

import {
    GetProductsAction,
    GetProductsSuccessAction,
    GetProductsFailedAction,
} from './products.actions';
import * as _ from 'lodash';
import { ProductService } from '../product/product.service';
import { UserState } from '../user';
import { ProductsStateModel } from './products.interface';

@State<ProductsStateModel>({
    name: 'products',
    defaults: {
        products: [],
        loaded: false,
        loading: false,
    },
})

export class ProductsState {
    constructor(
        private productService: ProductService,
        private store: Store,
    ) {

    }

    @Selector()
    public static loading(state: ProductsStateModel) {
      return state.loading;
    }

    @Selector()
    static getAllProducts(state: ProductsStateModel) {
        return state.products || null;
    }

    // GET PRODUCTS

    @Action(GetProductsAction)
    getProducts(sc: StateContext<ProductsStateModel>, action: GetProductsAction) {
        const user = this.store.selectSnapshot(UserState.geUser);
        sc.patchState({loading: true});
        return this.productService.getProducts(user && user.uid).subscribe((data) => {
            setTimeout(() => {
                sc.dispatch(new GetProductsSuccessAction(data));
            }, 10);
        }, error => {
            setTimeout(() => {
                sc.dispatch(new GetProductsFailedAction(error));
            }, 10);
        });
    }

    @Action(GetProductsSuccessAction)
    getProductsSuccess(sc: StateContext<ProductsStateModel>, action: GetProductsSuccessAction) {
        sc.patchState({
            products: action.products,
            loaded: true,
            loading: false,
        });
    }
}
