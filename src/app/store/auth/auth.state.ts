import {
    CheckSessionAction,
    LoginFailedAction,
    LoginSuccessAction,
    LoginWithEmailAndPasswordAction,
    LoginWithFacebookAction,
    LogoutAction,
    LogoutSuccessAction,
    RegisterFailedAction,
    RegisterSuccessAction,
    RegisterWithEmailAndPasswordAction
} from './auth.actions';
import { AuthService } from './auth.service';
import { GetUserAction, SetUserAction } from '../user/user.actions';
import { User, UserStateModel } from '../user/user.interface';
import { AngularFireAuth } from '@angular/fire/auth';
import { TranslateService } from '@ngx-translate/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { UserInfo } from 'firebase';
import { take, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/services/toast/toast.services';
import { timestamp } from 'src/app/util/common';
import { LoadingState } from 'src/app/interfaces/common.interface';

export interface AuthStateModel extends LoadingState {
    uid: string;
}
@State<AuthStateModel>({
    name: 'auth',
    defaults: {
        uid: null,
        loaded: false,
        loading: false,
    },
})
export class AuthState implements NgxsOnInit {
    /**
     * Selectors
     */
    @Selector()
    public static loading(state: UserStateModel) {
      return state.loading;
    }

    @Selector()
    static getUid(state: AuthStateModel) {
        return state.uid || null;
    }

    constructor(
        private translate: TranslateService,
        private auth: AuthService,
        private toast: ToastService,
        private afAuth: AngularFireAuth,
    ) {
    }

    ngxsOnInit(sc: StateContext<AuthStateModel>) {
        sc.dispatch(new CheckSessionAction());
    }

    @Action(CheckSessionAction)
    checkSession(sc: StateContext<AuthStateModel>) {
        return this.afAuth.authState.pipe(
            take(1),
            tap((user: UserInfo) => {
                if (user) {
                    setTimeout(() => {
                        sc.patchState({uid: user.uid});
                        sc.dispatch(new GetUserAction(user.uid));
                    }, 10);
                } else {
                    setTimeout(() => {
                        sc.dispatch(new LoginFailedAction('CheckSession: no user found'));
                    }, 10);
                }
            }));
    }

    /**********************************
     * LOGIN
     *********************************/
    @Action(LoginWithEmailAndPasswordAction)
    async loginWithEmailAndPassword(sc: StateContext<AuthStateModel>, action: LoginWithEmailAndPasswordAction) {
        sc.patchState({loading: true});
        await this.auth.signInWithEmail(action.email, action.password).then(data => {
            setTimeout(() => {
                sc.dispatch(new LoginSuccessAction(data.user.uid));
            }, 10);
        }, error => {
            setTimeout(() => {
                this.toast.show({ message: this.translate.instant('auth.state.login.error-auth'), color: 'danger' }); // Email o Password son incorrectos
                sc.dispatch(new LoginFailedAction(error));
            }, 10);
        });
    }

    @Action(LogoutAction)
    async logout(sc: StateContext<AuthStateModel>) {
        sc.patchState({loading: true});
        await this.afAuth.auth.signOut().then(() => {
            setTimeout(() => {
                sc.dispatch(new LogoutSuccessAction());
            }, 10);
        });
    }

    @Action(LoginSuccessAction)
    onLoginSuccess(sc: StateContext<AuthStateModel>, action: LoginSuccessAction) {
        sc.patchState({
            uid: action.uid,
            loaded: true,
            loading: false,
        });
        setTimeout(() => {
            sc.dispatch(new GetUserAction(action.uid));
        }, 10);
    }

    /**********************************
     * FACEBOOK LOGIN
     *********************************/
    @Action(LoginWithFacebookAction)
    async loginWithFacebook(sc: StateContext<AuthStateModel>) {
        const state = sc.getState();
        sc.patchState({loading: true});
        await this.auth.signInWithFacebook().then(data => {
            console.log(data);
            // If the user is new, we create a new account
            if (data.additionalUserInfo.isNewUser) {
                const userInformation: User = {
                    uid: data.user.uid,
                    name: data.user.displayName,
                    lastConnection: timestamp(),
                    avatar: data.user.photoUR,
                    email: data.user.email,
                };
                setTimeout(() => {
                    sc.dispatch(new SetUserAction(userInformation));
                }, 10);
            } else {
                setTimeout(() => {
                    sc.patchState({loading: true});
                    sc.dispatch(new LoginSuccessAction(data.user.uid));
                }, 10);
            }
        }, error => {
            setTimeout(() => {
                this.toast.show({ message: this.translate.instant('auth.state.error.facebook-auth'), color: 'danger' }); // El usuario de facebook esta fallando
                sc.dispatch(new LoginFailedAction(error));
            }, 10);
        });
    }

    /**********************************
     * REGISTER
     *********************************/
    @Action(RegisterWithEmailAndPasswordAction)
    async registerWithEmailAndPassword(sc: StateContext<AuthStateModel>, action: RegisterWithEmailAndPasswordAction) {
        sc.patchState({loaded: false, loading: true});
        await this.auth.createUserWithEmailAndPassword(action.email, action.password).then(data => {
            console.log(data);
            const userInformation: User = {
                uid: data.user.uid,
                name: action.name,
                lastConnection: timestamp(),
                avatar: '../../assets/images/default-avatar.png',
                email: data.user.email,
            };
            setTimeout(() => {
                sc.dispatch(new RegisterSuccessAction(userInformation));
            }, 10);
        }, error => {
            setTimeout(() => {
                this.toast.show({ message: this.translate.instant('auth.state.register.not-allowd-register'), color: 'danger' }); //No puedes registrarte con estos datos
                sc.dispatch(new RegisterFailedAction(error));
            }, 10);
        });
    }

    @Action(RegisterSuccessAction)
    registerSuccess(sc: StateContext<AuthStateModel>, action: RegisterSuccessAction) {
        sc.patchState({uid: action.user.uid, loaded: true, loading: true});
        setTimeout(() => {
            sc.dispatch(new SetUserAction(action.user));
        }, 10);
    }
    @Action([LoginFailedAction, LogoutSuccessAction, RegisterFailedAction])
    resetAuthState(sc: StateContext<AuthStateModel>) {
        sc.setState({
            uid: null,
            loaded: false,
            loading: false
        });
    }


}
