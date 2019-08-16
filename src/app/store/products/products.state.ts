import { Action, Selector, State, StateContext, Store } from '@ngxs/store';

import {
    GetProductsAction,
    GetProductsSuccessAction,
    GetProductsFailedAction,
    GetMyProductsAction,
    GetFavoriteProductsAction
} from './products.actions';
import * as _ from 'lodash';
import { ProductService } from '../product/product.service';
import { UserState } from '../user';
import { ProductsStateModel } from './products.interface';
import { LogoutSuccessAction } from '../auth';

@State<ProductsStateModel>({
    name: 'products',
    defaults: {
        products: [],
        myProducts: [],
        favoriteProducts: [],
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
    @Selector()
    static getMyProducts(state: ProductsStateModel) {
        return state.myProducts || null;
    }
    @Selector()
    static getFavoriteProducts(state: ProductsStateModel) {
        return state.favoriteProducts || null;
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

    @Action(GetMyProductsAction)
    async getMyProducts(sc: StateContext<ProductsStateModel>) {
        const state = sc.getState();
        const user = this.store.selectSnapshot(UserState.geUser);
        await this.productService.getMyProducts(user.uid).subscribe((products) => {
            setTimeout(() => {
                sc.setState({
                    ...state,
                    myProducts: products,
                    loaded: true,
                });
            }, 500);
        }, error => {
            console.log(error);
        });
    }
    @Action(GetFavoriteProductsAction)
    async getFavoriteProducts(sc: StateContext<ProductsStateModel>) {
        const state = sc.getState();
        const user = this.store.selectSnapshot(UserState.geUser);
        await this.productService.getFavoriteProductsByUid(user.uid).subscribe((products) => {
            sc.setState({
                ...state,
                favoriteProducts: products,
                loaded: true,
            });
        }, error => {
            console.log(error);
        });
    }
    @Action([LogoutSuccessAction])
    resetProductsState(sc: StateContext<ProductsStateModel>) {
        sc.setState({
            myProducts: [],
            favoriteProducts: [],
            loaded: true
        });
    }
}
