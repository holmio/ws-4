import {
    GetUserAction,
    GetUserFailedAction,
    GetUserSuccessAction,
    SetUserAction,
    SetUserFailedAction,
    SetUserSuccessAction,
    UpdateAvatarUserAction,
    UpdateAvatarUserFailedAction,
    UpdateAvatarUserSuccessAction,
    UpdateUserAction,
    UpdateUserFailedAction,
    UpdateUserSuccessAction,
    GetMyProductsAction,
    GetVisitedUserAction,
} from './user.actions';
import { UserService } from './user.service';
import { LoginSuccessAction, LogoutSuccessAction } from '../auth';
import { User, UserStateModel } from '../user/user.interface';
import {
    Action,
    Selector,
    State,
    StateContext
} from '@ngxs/store';
import { ProductService } from '../product/product.service';
import { mergeMap, map, take } from 'rxjs/operators';

@State<UserStateModel>({
    name: 'user',
    defaults: {
        user: null,
        visitedUser: null,
        myProducts: [],
        favoriteProducts: [],
        loaded: false,
    },
})
export class UserState {

    constructor(
        private productService: ProductService,
        private userService: UserService,
    ) {
    }

    /**
     * Selectors
     */
    @Selector()
    static geUser(state: UserStateModel) {
        return state.user;
    }
    @Selector()
    static getMyProducts(state: UserStateModel) {
        return state.myProducts;
    }
    @Selector()
    static getFavoriteProducts(state: UserStateModel) {
        return state.favoriteProducts;
    }
    @Selector()
    static getVisitedUser(state: UserStateModel) {
        return state.visitedUser;
    }

    @Action(GetUserAction)
    getUserData(sc: StateContext<UserStateModel>, action: GetUserAction) {
        const state = sc.getState();
        sc.setState({
            ...state,
            loaded: false,
        });
        this.userService.getUser(action.uid).subscribe((user: User) => {
            setTimeout(() => {
                sc.dispatch(new GetUserSuccessAction(user));
            }, 10);
        }, error => {
            setTimeout(() => {
                sc.dispatch(new GetUserFailedAction(error));
            }, 10);
        });
    }
    @Action(GetUserSuccessAction)
    getUserSuccess(sc: StateContext<UserStateModel>, action: GetUserSuccessAction) {
        const state = sc.getState();
        sc.setState({
            ...state,
            user: action.user,
            loaded: true,
        });
    }

    @Action(UpdateAvatarUserAction)
    updateAvatarUserData(sc: StateContext<UserStateModel>, action: UpdateAvatarUserAction) {
        const state = sc.getState();
        sc.setState({
            ...state,
            loaded: false,
        });
        this.userService.updateAvatar(action.file, state.user.uid).then(() => {
            setTimeout(() => {
                sc.dispatch(new UpdateAvatarUserSuccessAction());
            }, 10);
        }, error => {
            setTimeout(() => {
                sc.dispatch(new UpdateAvatarUserFailedAction(error));
            }, 10);
        });
    }
    @Action(UpdateAvatarUserSuccessAction)
    updateAvatarUserSuccess(sc: StateContext<UserStateModel>, action: UpdateAvatarUserSuccessAction) {
        const state = sc.getState();
        sc.setState({
            ...state,
            loaded: true,
        });
        console.log('BIEEEEN FOTOOOOOO', state.user);
    }

    @Action(UpdateUserAction)
    updateUserData(sc: StateContext<UserStateModel>, action: UpdateUserAction) {
        const state = sc.getState();
        sc.setState({
            ...state,
            loaded: false,
        });
        this.userService.updateUser(state.user.uid, action.user).then(() => {
            setTimeout(() => {
                sc.dispatch(new UpdateUserSuccessAction());
            }, 10);
        }, error => {
            setTimeout(() => {
                sc.dispatch(new UpdateUserFailedAction(error));
            }, 10);
        });
    }
    @Action(UpdateUserSuccessAction)
    updateUserSuccess(sc: StateContext<UserStateModel>, action: UpdateUserSuccessAction) {
        const state = sc.getState();
        sc.setState({
            ...state,
            loaded: true,
        });
    }

    @Action(SetUserAction)
    setUserData(sc: StateContext<UserStateModel>, action: SetUserAction) {
        const uid = action.user.uid;
        const state = sc.getState();
        sc.setState({
            ...state,
            loaded: false,
        });
        console.log(action.user);
        this.userService.setUser(uid, action.user).then((data) => {
            setTimeout(() => {
                sc.dispatch(new SetUserSuccessAction(action.user));
            }, 10);
        }, error => {
            setTimeout(() => {
                sc.dispatch(new SetUserFailedAction(error));
            }, 10);
        });
    }

    @Action(SetUserSuccessAction)
    setUserSuccess(sc: StateContext<UserStateModel>, action: SetUserSuccessAction) {
        const state = sc.getState();
        sc.setState({
            ...state,
            user: action.user,
            loaded: true,
        });
        setTimeout(() => {
            sc.dispatch(new LoginSuccessAction(action.user.uid));
        }, 10);
    }

    @Action(GetMyProductsAction)
    async getMyProducts(sc: StateContext<UserStateModel>) {
        const state = sc.getState();
        const myProducts$ = this.productService.getMyProducts(state.user.uid);
        const favorites$ = this.productService.getFavorites(state.user.uid);
        await myProducts$.pipe(
            mergeMap((myProducts) =>
                favorites$.pipe(
                    map(
                        (favorites) => Object.assign({}, { favorites, myProducts })
                    )
                )
            ),
        ).subscribe((products) => {
            sc.setState({
                ...state,
                myProducts: products.myProducts,
                favoriteProducts: products.favorites,
                loaded: true,
            });
        }, error => {
            console.log(error);
        });
    }

    @Action(GetVisitedUserAction)
    async getVisitedUser(sc: StateContext<UserStateModel>, action: GetVisitedUserAction) {
        const state = sc.getState();
        const user$ = this.userService.getUser(action.uid).pipe(take(1));
        const myProducts$ = this.productService.getMyProducts(action.uid).pipe(take(1));
        const favorites$ = this.productService.getFavorites(action.uid).pipe(take(1));
        await user$.pipe(
            mergeMap((user) =>
                favorites$.pipe(
                    mergeMap((favorites) =>
                        myProducts$.pipe(
                            map(
                                (products) => {
                                    sc.setState({
                                        ...state,
                                        visitedUser: {user, products, favorites},
                                        loaded: true,
                                    });
                                })
                            )
                        )
                )
            ),
        );
    }

    @Action([GetUserFailedAction, LogoutSuccessAction])
    resetUserState(sc: StateContext<UserStateModel>) {
        sc.setState({
            user: null,
            visitedUser: null,
            myProducts: [],
            favoriteProducts: [],
            loaded: true
        });
    }
}
