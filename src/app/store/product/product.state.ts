import { Observable } from 'rxjs';

import { NavController } from '@ionic/angular';
import { Action, Select, Selector, State, StateContext, Store } from '@ngxs/store';

import { AuthState, AuthStateModel } from '../auth';
import {
    GetProductAction, GetProductFailedAction, GetProductSuccessAction, SetProductAction,
    SetProductFailedAction, SetProductSuccessAction, UpdateProductAction, UpdateProductFailedAction,
    UpdateProductSuccessAction,
    AddFavoriteAction,
    AddFavoriteSuccessAction,
    AddFavoriteFailedAction,
    RemoveFavoriteAction,
    RemoveFavoriteSuccessAction,
    RemoveFavoriteFailedAction,
    DeleteProductAction,
    DeleteProductSuccessAction,
    DeleteProductFailedAction
} from './product.actions';
import { ProductStateModel } from './product.interface';
import { ProductService } from './product.service';
import { UserState } from '../user';
import * as _ from 'lodash';

@State<ProductStateModel>({
    name: 'product',
    defaults: {
        isUserProduct: false,
        isFavorite: false,
        product: null,
        loaded: false,
    },
})
export class ProductState {

    @Select(AuthState.getUid) uidUser$: Observable<string | undefined>;
    constructor(
        private productService: ProductService,
        private navController: NavController,
        private store: Store,
    ) {

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

    @Selector()
    static getIsFavorite(productState: ProductStateModel) {
        return productState.isFavorite;
    }

    @Selector([AuthState])
    static getIsUserProduct(productState: ProductStateModel, authState: AuthStateModel) {
        return productState.product.user.uid === authState.uid;
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
        const user = this.store.selectSnapshot(UserState.geUser);
        sc.setState({
            ...state,
            isFavorite: (user && _.includes(action.product.followers, user.uid)) || false,
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
        // Necessary to get permission to edit table products
        action.product.user = {
            uid: state.product.user.uid,
        }
        action.product.uid = state.product.uid;
        await this.productService.updateProduct(action.product).then(() => {
            sc.dispatch(new UpdateProductSuccessAction());
        }, error => {
            sc.dispatch(new UpdateProductFailedAction(error));
        });
    }

    // DELETE PRODUCT

    @Action(DeleteProductAction)
    async deleteProduct(sc: StateContext<ProductStateModel>) {
        const state = sc.getState();
        sc.setState({
            ...state,
            loaded: false,
        });
        await this.productService.deleteProduct(state.product).then(() => {
            sc.dispatch(new DeleteProductSuccessAction());
        }, error => {
            sc.setState({
                ...state,
                loaded: true,
            });
            sc.dispatch(new DeleteProductFailedAction(error));
        });
    }

    @Action([UpdateProductSuccessAction, DeleteProductSuccessAction])
    resetProductSuccess(sc: StateContext<ProductStateModel>) {
        const state = sc.getState();
        sc.setState({
            ...state,
            loaded: true,
        });
        this.navController.back();
    }

    // ADD FAVORITE

    @Action(AddFavoriteAction)
    async addFavorite(sc: StateContext<ProductStateModel>, action: AddFavoriteAction) {
        const state = sc.getState();
        const user = this.store.selectSnapshot(UserState.geUser);
        await this.productService.addFavorite(user.uid, state.product.uid).then(() => {
            sc.setState({
                ...state,
                isFavorite: true,
            });
            sc.dispatch(new AddFavoriteSuccessAction());
        }, error => {
            sc.dispatch(new AddFavoriteFailedAction(error));
        })
    }

    // REMOVE FAVORITE

    @Action(RemoveFavoriteAction)
    async removeFavorite(sc: StateContext<ProductStateModel>, action: RemoveFavoriteAction) {
        const state = sc.getState();
        const user = this.store.selectSnapshot(UserState.geUser);
        await this.productService.removeFavorite(user.uid, state.product.uid).then(() => {
            sc.setState({
                ...state,
                isFavorite: false,
            });
            sc.dispatch(new RemoveFavoriteSuccessAction());
        }, error => {
            sc.dispatch(new RemoveFavoriteFailedAction(error));
        })
    }

    // SET PRODUCT

    @Action(SetProductAction)
    async setProduct(sc: StateContext<ProductStateModel>, action: SetProductAction) {
        const state = sc.getState();
        sc.setState({
            ...state,
            loaded: false,
        });
        // select the snapshot state from users
        const user = this.store.selectSnapshot(UserState.geUser);
        action.product.timestamp = this.timestamp;
        action.product.isSold = false;
        action.product.isEnabled = true;
        action.product.user = {
            uid: user.uid,
        };
        action.product.followers = [];
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
            isFavorite: false,
            product: null,
            loaded: false
        });
    }
}
