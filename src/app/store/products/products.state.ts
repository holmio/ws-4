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
    },
})

export class ProductsState {
    constructor(
        private productService: ProductService,
        private store: Store,
    ) {

    }

    @Selector()
    static getAllProducts(state: ProductsStateModel) {
        return state.products || null;
    }

    // GET PRODUCTS

    @Action(GetProductsAction)
    async getProducts(sc: StateContext<ProductsStateModel>, action: GetProductsAction) {
        const state = sc.getState();
        const user = this.store.selectSnapshot(UserState.geUser);
        await this.productService.getProducts(user && user.uid).subscribe((data) => {
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
        const state = sc.getState();
        sc.setState({
            ...state,
            products: action.products,
            loaded: true,
        });
    }
}
