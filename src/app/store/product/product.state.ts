import {
    AddFavoriteAction,
    AddFavoriteFailedAction,
    AddFavoriteSuccessAction,
    DeleteProductAction,
    DeleteProductFailedAction,
    DeleteProductSuccessAction,
    DistroyProductAction,
    GetProductAction,
    GetProductFailedAction,
    GetProductSuccessAction,
    GetUserProductAction,
    RemoveFavoriteAction,
    RemoveFavoriteFailedAction,
    RemoveFavoriteSuccessAction,
    SetProductAction,
    SetProductFailedAction,
    SetProductSuccessAction,
    UpdateProductAction,
    UpdateProductFailedAction,
    UpdateProductSuccessAction
    } from './product.actions';
import { ProductStateModel } from './product.interface';
import { ProductService } from './product.service';
import { AuthState, AuthStateModel, LoginSuccessAction, LogoutSuccessAction } from '../auth';
import { UserState } from '../user';
import { UserService } from '../user/user.service';
import { TranslateService } from '@ngx-translate/core';
import {
    Action,
    Actions,
    ofAction,
    Select,
    Selector,
    State,
    StateContext,
    Store
    } from '@ngxs/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastService } from 'src/app/services/toast/toast.services';
import { timestamp } from 'src/app/util/common';



@State<ProductStateModel>({
    name: 'product',
    defaults: {
        isUserProduct: false,
        isFavorite: false,
        userInfo: null,
        product: null,
        loaded: false,
        loading: false,
    },
})
export class ProductState {

    @Select(AuthState.getUid) uidUser$: Observable<string | undefined>;
    constructor(
        private productService: ProductService,
        private userService: UserService,
        private toast: ToastService,
        private actions$: Actions,
        private translate: TranslateService,
        private store: Store,
    ) {

    }
    /**
     * Selectors
     */
    @Selector()
    public static loading(state: ProductStateModel) {
      return state.loading;
    }

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

    // GET PRODUCT

    @Action(GetProductAction)
    getProduct(sc: StateContext<ProductStateModel>, action: GetProductAction) {
        sc.patchState({loading: true});
        return this.productService.getProduct(action.uid)
            .pipe(takeUntil(this.actions$.pipe(ofAction(DistroyProductAction))))
            .subscribe(data => {
                setTimeout(() => {
                    sc.dispatch(new GetProductSuccessAction(data));
                }, 10);
            }, error => {
                setTimeout(() => {
                    this.toast.show({message: this.translate.instant('product.toast.get-product.error'), color: 'danger' });
                    sc.dispatch(new GetProductFailedAction(error));
                }, 10);
            });
    }

    @Action(GetProductSuccessAction)
    getProductSuccess(sc: StateContext<ProductStateModel>, action: GetProductSuccessAction) {
        sc.patchState({
            product: action.product,
            loaded: true,
            loading: false,
        });
    }

    // GET USER INFO

    @Action(GetUserProductAction)
    getUserInfo(sc: StateContext<ProductStateModel>) {
        const state = sc.getState();
        sc.patchState({loading: true});
        return this.userService.getShortUserInfo(state.product.userUid).subscribe(data => {
            sc.patchState({userInfo: data, loading: false});
        }, error => {
            sc.patchState({loading: false});
        });
    }

    // UPDATE PRODUCT

    @Action(UpdateProductAction)
    async updateProduct(sc: StateContext<ProductStateModel>, action: UpdateProductAction) {
        const state = sc.getState();
        sc.patchState({loading: true});
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
                this.toast.show({message: this.translate.instant('product.toast.update-product.error'), color: 'danger' });
                sc.dispatch(new UpdateProductFailedAction(error));
            }, 10);
        });
    }

    // DELETE PRODUCT

    @Action(DeleteProductAction)
    async deleteProduct(sc: StateContext<ProductStateModel>) {
        const state = sc.getState();
        sc.patchState({loading: true});
        await this.productService.deleteProduct(state.product).then(() => {
            setTimeout(() => {
                sc.dispatch(new DeleteProductSuccessAction());
            }, 10);
        }, error => {
            setTimeout(() => {
                this.toast.show({message: this.translate.instant('product.toast.delete-product.error'), color: 'danger' });
                sc.dispatch(new DeleteProductFailedAction(error));
            }, 10);
        });
    }

    @Action([UpdateProductSuccessAction, DeleteProductSuccessAction, DeleteProductFailedAction, SetProductSuccessAction])
    resetProductSuccess(sc: StateContext<ProductStateModel>) {
        sc.patchState({loading: false});
    }

    // ADD FAVORITE

    @Action(AddFavoriteAction)
    async addFavorite(sc: StateContext<ProductStateModel>, action: AddFavoriteAction) {
        const state = sc.getState();
        const user = this.store.selectSnapshot(UserState.geUser);
        await this.productService.addFavorite(user.uid, state.product.uid).then(() => {
            sc.patchState({isFavorite: true});
            setTimeout(() => {
                sc.dispatch(new AddFavoriteSuccessAction());
            }, 10);
        }, error => {
            setTimeout(() => {
                this.toast.show({message: this.translate.instant('product.toast.add-favorite.error'), color: 'danger' });
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
            sc.patchState({isFavorite: false});
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
        sc.patchState({loading: true});
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
                this.toast.show({message: this.translate.instant('product.toast.set-product.error'), color: 'danger' });
                sc.dispatch(new SetProductFailedAction(error));
            }, 10);
        });
    }

    @Action([LoginSuccessAction, GetProductSuccessAction])
    checkFavoriteProductState(sc: StateContext<ProductStateModel>) {
        const userUid = this.store.selectSnapshot(AuthState.getUid);
        const state = sc.getState();
        sc.patchState({
            ...state,
            isFavorite: userUid && (state.product && !!_.includes(state.product.followers, userUid)) || false,
            loading: false,
        });
    }

    @Action([LogoutSuccessAction])
    resetFavoriteProductState(sc: StateContext<ProductStateModel>) {
        sc.patchState({
            isFavorite: null,
            loading: false,
        });
    }

    @Action([GetProductFailedAction])
    resetProductState(sc: StateContext<ProductStateModel>) {
        sc.setState({
            isUserProduct: false,
            isFavorite: false,
            product: null,
            userInfo: null,
            loaded: false,
            loading: false,
        });
    }
}
