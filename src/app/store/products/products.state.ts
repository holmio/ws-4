import { Action, Selector, State, StateContext, Store } from '@ngxs/store';

import {
    GetProductsAction,
    GetProductsSuccessAction,
    GetProductsFailedAction,
} from './products.actions';
import * as _ from 'lodash';
import { ProductService } from '../product/product.service';
import { UserState, GetUserSuccessAction, GetUserFailedAction } from '../user';
import { ProductsStateModel } from './products.interface';
import { LoadingState } from 'src/app/interfaces/common.interface';
import { Product } from '../product';
import { AuthState, InitAppAction, LogoutSuccessAction, LoginFailedAction } from '../auth';

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
    public static loading(state: LoadingState) {
      return state.loading;
    }

    @Selector()
    static getAllProducts(state: ProductsStateModel) {
        return state.products || null;
    }

    // GET PRODUCTS

    @Action(GetProductsAction)
    getProducts(sc: StateContext<ProductsStateModel>, action: GetProductsAction) {
        const userUid = this.store.selectSnapshot(AuthState.getUid);
        sc.patchState({loading: true});
        return this.productService.getProducts(userUid).subscribe((products: Product[]) => {
            setTimeout(() => {
                sc.dispatch(new GetProductsSuccessAction(
                    _.remove(products, (product) => product.userUid !== userUid)
                ));
            }, 10);
        }, error => {
            setTimeout(() => {
                sc.dispatch(new GetProductsFailedAction(error));
            }, 10);
        });
    }

    @Action([GetUserSuccessAction, GetUserFailedAction, LogoutSuccessAction, LoginFailedAction])
    updateProducts() {
        this.store.dispatch(new GetProductsAction());
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
