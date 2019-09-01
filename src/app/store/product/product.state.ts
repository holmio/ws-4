import { Observable } from 'rxjs';

import { Action, Select, Selector, State, StateContext, Store, Actions, ofAction } from '@ngxs/store';

import { AuthState, AuthStateModel, LoginSuccessAction, LogoutSuccessAction } from '../auth';
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
    DeleteProductFailedAction,
    GetUserProductAction,
    DistroyProductAction
} from './product.actions';
import { ProductStateModel } from './product.interface';
import { ProductService } from './product.service';
import { UserState } from '../user';
import * as _ from 'lodash';
import { UserService } from '../user/user.service';
import { timestamp } from 'src/app/util/common';
import { takeUntil } from 'rxjs/operators';

@State<ProductStateModel>({
    name: 'product',
    defaults: {
        isUserProduct: false,
        isFavorite: false,
        userInfo: null,
        product: null,
        loaded: false,
    },
})
export class ProductState {

    @Select(AuthState.getUid) uidUser$: Observable<string | undefined>;
    constructor(
        private productService: ProductService,
        private userService: UserService,
        private actions$: Actions,
        private store: Store,
    ) {

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

    @Selector()
    static getUserOfProduct(productState: ProductStateModel) {
        return productState.userInfo;
    }

    @Selector([AuthState])
    static getIsUserProduct(productState: ProductStateModel, authState: AuthStateModel) {
        return productState.product.userUid === authState.uid;
    }

    @Selector()
    static loading(state: ProductStateModel) {
        return state.loaded;
    }

    // GET PRODUCT

    @Action(GetProductAction)
    getProduct(sc: StateContext<ProductStateModel>, action: GetProductAction) {
        const state = sc.getState();
        sc.setState({
            ...state,
            loaded: false,
        });
        return this.productService.getProduct(action.uid)
            .pipe(takeUntil(this.actions$.pipe(ofAction(DistroyProductAction))))
            .subscribe(data => {
                setTimeout(() => {
                    sc.dispatch(new GetProductSuccessAction(data));
                }, 10);
            }, error => {
                setTimeout(() => {
                    sc.dispatch(new GetProductFailedAction(error));
                }, 10);
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

    // GET USER INFO

    @Action(GetUserProductAction)
    getUserInfo(sc: StateContext<ProductStateModel>) {
        const state = sc.getState();
        return this.userService.getShortUserInfo(state.product.userUid).subscribe(data => {
            sc.setState({
                ...state,
                userInfo: data,
            });
        }, error => {
            console.log(error);
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
        action.product.timestamp = timestamp();
        // Necessary to get permission to edit table products
        action.product.userUid = state.product.userUid;
        action.product.uid = state.product.uid;
        await this.productService.updateProduct(action.product, action.imagesToDelete).then(() => {
            setTimeout(() => {
                sc.dispatch(new UpdateProductSuccessAction());
            }, 10);
        }, error => {
            setTimeout(() => {
                sc.dispatch(new UpdateProductFailedAction(error));
            }, 10);
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
            setTimeout(() => {
                sc.dispatch(new DeleteProductSuccessAction());
            }, 10);
        }, error => {
            setTimeout(() => {
                sc.dispatch(new DeleteProductFailedAction(error));
            }, 10);
        });
    }

    @Action([UpdateProductSuccessAction, DeleteProductSuccessAction, DeleteProductFailedAction])
    resetProductSuccess(sc: StateContext<ProductStateModel>) {
        const state = sc.getState();
        sc.setState({
            ...state,
            loaded: true,
        });
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
            setTimeout(() => {
                sc.dispatch(new AddFavoriteSuccessAction());
            }, 10);
        }, error => {
            setTimeout(() => {
                sc.dispatch(new AddFavoriteFailedAction(error));
            }, 10);
        });
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
            setTimeout(() => {
                sc.dispatch(new RemoveFavoriteSuccessAction());
            }, 10);
        }, error => {
            setTimeout(() => {
                sc.dispatch(new RemoveFavoriteFailedAction(error));
            }, 10);
        });
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
        action.product.timestamp = timestamp();
        action.product.createdAt = timestamp();
        action.product.isSold = false;
        action.product.isEnabled = true;
        action.product.userUid = user.uid;
        action.product.followers = [];
        await this.productService.setProduct(action.product).then((uid) => {
            setTimeout(() => {
                sc.dispatch(new SetProductSuccessAction(uid));
            }, 10);
        }, error => {
            setTimeout(() => {
                sc.dispatch(new SetProductFailedAction(error));
            }, 10);
        });
    }

    @Action(SetProductSuccessAction)
    setProductSuccess(sc: StateContext<ProductStateModel>, action: SetProductSuccessAction) {
        const state = sc.getState();
        sc.setState({
            ...state,
            loaded: true,
        });
    }

    @Action([LogoutSuccessAction, LoginSuccessAction, GetProductSuccessAction])
    checkFavoriteProductState(sc: StateContext<ProductStateModel>) {
        const user = this.store.selectSnapshot(UserState.geUser);
        const state = sc.getState();
        sc.setState({
            ...state,
            isFavorite: (user && state.product && !!_.includes(state.product.followers, user.uid)) || false,
            loaded: true
        });
    }

    @Action([GetProductFailedAction])
    resetProductState(sc: StateContext<ProductStateModel>) {
        sc.setState({
            isUserProduct: false,
            isFavorite: false,
            product: null,
            userInfo: null,
            loaded: false
        });
    }
}
