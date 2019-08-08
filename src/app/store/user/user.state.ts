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
    UpdateUserSuccessAction
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

@State<UserStateModel>({
    name: 'user',
    defaults: {
        user: null,
        loaded: false,
    },
})
export class UserState {
    
    constructor(
        private userService: UserService,
    ) {
    }

    /**
     * Selectors
     */
    @Selector()
    static geUser(state: UserStateModel) {
        return state.user || null;
    }

    @Action(GetUserAction)
    getUserData(sc: StateContext<UserStateModel>, action: GetUserAction) {
        const state = sc.getState();
        sc.setState({
            ...state,
            loaded: false,
        });
        this.userService.getUser(action.uid).subscribe((user: User) => {
            sc.dispatch(new GetUserSuccessAction(user));
        }, error => {
            sc.dispatch(new GetUserFailedAction(error));
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
            sc.dispatch(new UpdateAvatarUserSuccessAction());
        }, error => {
            sc.dispatch(new UpdateAvatarUserFailedAction(error));
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
            sc.dispatch(new UpdateUserSuccessAction());
        }, error => {
            sc.dispatch(new UpdateUserFailedAction(error));
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
            console.log(data);
            sc.dispatch(new SetUserSuccessAction(action.user));
        }, error => {
            sc.dispatch(new SetUserFailedAction(error));
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
        sc.dispatch(new LoginSuccessAction(action.user.uid));
    }
    @Action([GetUserFailedAction, LogoutSuccessAction])
    resetUserState(sc: StateContext<UserStateModel>) {
        sc.setState({
            user: null,
            loaded: true
        });
    }
}