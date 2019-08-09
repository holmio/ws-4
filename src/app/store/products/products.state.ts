import { Action, Selector, State, StateContext, Store } from '@ngxs/store';

import {
    GetProductsAction,
    GetProductsSuccessAction,
    GetProductsFailedAction
} from './products.actions';
import * as _ from 'lodash';
import { ProductService } from '../product/product.service';
import { UserState } from '../user';
import { ProductsStateModel } from './products.interface';

@State<ProductsStateModel>({
    name: 'products',
    defaults: {
        products: null,
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
        await this.productService.getProducts().subscribe((data) => {
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
        const user = this.store.selectSnapshot(UserState.geUser);
        if (user) {
            action.products = _.remove(action.products, (n) => {
                return n.user.uid !== user.uid;
            });
        }
        sc.setState({
            ...state,
            products: action.products,
            loaded: true,
        });
    }
}
