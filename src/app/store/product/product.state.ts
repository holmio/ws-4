import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { NavController } from '@ionic/angular';
import { Action, Select, Selector, State, StateContext, NgxsOnInit } from '@ngxs/store';

import { AuthState, AuthStateModel } from '../auth';
import {
    GetProductAction, GetProductFailedAction, GetProductSuccessAction, SetProductAction,
    SetProductFailedAction, SetProductSuccessAction, UpdateProductAction, UpdateProductFailedAction,
    UpdateProductSuccessAction
} from './product.actions';
import { ProductStateModel } from './product.interface';
import { ProductService } from './product.service';

@State<ProductStateModel>({
    name: 'product',
    defaults: {
        isUserProduct: false,
        product: null,
        loaded: false,
    },
})
export class ProductState implements NgxsOnInit {

    @Select(AuthState.getUid) uidUser$: Observable<string | undefined>;
    private uidUser: string;
    constructor(
        private productService: ProductService,
        private navController: NavController,
    ) {
        
    }

    ngxsOnInit(sc: StateContext<AuthStateModel>) {
        this.uidUser$.pipe(
            filter((uid) => !!uid),
            take(1)
        ).subscribe(uid => this.uidUser = uid);
    }

    /// Firebase Server Timestamp
    get timestamp() {
        return new Date().getTime();
    }

    /**
     * Selectors
     */
    @Selector()
    static getProduct(state: ProductStateModel) {
        return state.product || null;
    }

    @Selector([AuthState])
    static getIsUserProduct(productState: ProductStateModel, authState: AuthStateModel) {
        return productState.product.uidUser === authState.uid;
    }

    @Selector()
    static loading(state: ProductStateModel) {
        return state.loaded;
    }

    // GET PRODUCT

    @Action(GetProductAction)
    async getProduct(sc: StateContext<ProductStateModel>, action: GetProductAction) {
        const state = sc.getState();
        sc.setState({
            ...state,
            loaded: false,
        });
        await this.productService.getProduct(action.uid).subscribe(data => {
            sc.dispatch(new GetProductSuccessAction(data));
        }, error => {
            sc.dispatch(new GetProductFailedAction(error));
        });
    }

    @Action(GetProductSuccessAction)
    getProductSuccess(sc: StateContext<ProductStateModel>, action: GetProductSuccessAction) {
        const state = sc.getState();
        sc.setState({
            ...state,
            product: action.product,
            loaded: true,
        });
    }

    // UPDATE PRODUCT

    @Action(UpdateProductAction)
    async updateProduct(sc: StateContext<ProductStateModel>, action: UpdateProductAction) {
        const state = sc.getState();
        sc.setState({
            ...state,
            loaded: false,
        });
        action.product.timestamp = this.timestamp;
        action.product.uid = state.product.uid;
        action.product.uidUser = state.product.uidUser;
        await this.productService.updateProduct(action.product).then(() => {
            sc.dispatch(new UpdateProductSuccessAction());
        }, error => {
            sc.dispatch(new UpdateProductFailedAction(error));
        });
    }

    @Action(UpdateProductSuccessAction)
    updateProductSuccess(sc: StateContext<ProductStateModel>, action: UpdateProductSuccessAction) {
        const state = sc.getState();
        sc.setState({
            ...state,
            loaded: true,
        });
        this.navController.back();
    }

    // SET PRODUCT

    @Action(SetProductAction)
    async setProduct(sc: StateContext<ProductStateModel>, action: SetProductAction) {
        const state = sc.getState();
        sc.setState({
            ...state,
            loaded: false,
        });
        action.product.timestamp = this.timestamp;
        action.product.isSold = false;
        action.product.isEnabled = true;
        action.product.uidUser = this.uidUser;
        action.product.thumbnail = 'https://picsum.photos/400/400?random=1';
        await this.productService.setProduct(action.product).then((uid) => {
            sc.dispatch(new SetProductSuccessAction(uid));
        }, error => {
            sc.dispatch(new SetProductFailedAction(error));
        });
    }

    @Action(SetProductSuccessAction)
    setProductSuccess(sc: StateContext<ProductStateModel>, action: SetProductSuccessAction) {
        const state = sc.getState();
        sc.setState({
            ...state,
            loaded: true,
        });
        this.navController.navigateRoot('product/detail/' + action.uid);
    }

    @Action([GetProductFailedAction])
    resetProductState(sc: StateContext<ProductStateModel>) {
        sc.setState({
            isUserProduct: false,
            product: null,
            loaded: false
        });
    }
}
