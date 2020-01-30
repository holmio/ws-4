import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import * as _ from 'lodash';
import { LoadingState } from 'src/app/interfaces/common.interface';
import { PaginationService } from 'src/app/services/firestore/pagination.service';
import { APP_CONST } from 'src/app/util/app.constants';
import { AuthState, LoginFailedAction, LogoutSuccessAction } from '../auth';
import { Product } from '../product';
import { ProductService } from '../product/product.service';
import { GetUserFailedAction, GetUserSuccessAction } from '../user';
import { GetProductsAction, GetProductsSuccessAction, GetMoreProductsAction } from './products.actions';
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
        private page: PaginationService,
    ) {
        const opts = {
            limit: 2,
            reverse: true,
            prepend: false
        };
        this.page.init(APP_CONST.db.productsDetail, 'timestamp', opts);

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
        sc.patchState({ loading: true });

        return this.page.data.subscribe((products: Product[]) => {
            sc.dispatch(new GetProductsSuccessAction(
                _.remove(products, (product) => product.userUid !== userUid)
            ));
        });
    }

    @Action(GetMoreProductsAction)
    getMoreProducts(sc: StateContext<ProductsStateModel>, action: GetMoreProductsAction) {
        const userUid = this.store.selectSnapshot(AuthState.getUid);
        sc.patchState({ loading: true });
        this.page.more();
    }

    @Action([GetUserSuccessAction, GetUserFailedAction, LogoutSuccessAction, LoginFailedAction])
    updateProducts() {
        this.store.dispatch(new GetProductsAction());
    }

    @Action(GetProductsSuccessAction)
    getProductsSuccess(sc: StateContext<ProductsStateModel>, action: GetProductsSuccessAction) {
        sc.patchState({
            products: [...action.products],
            loaded: true,
            loading: false,
        });
    }
}
