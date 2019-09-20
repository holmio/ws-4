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
import { User } from '../user/user.interface';
import { AngularFireAuth } from '@angular/fire/auth';
import {
    Action,
    NgxsOnInit,
    Selector,
    State,
    StateContext
    } from '@ngxs/store';
import { UserInfo } from 'firebase';
import { take, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/services/toast/toast.services';
import { timestamp } from 'src/app/util/common';

export interface AuthStateModel {
    uid: string;
    loaded: boolean;
}
@State<AuthStateModel>({
    name: 'auth',
    defaults: {
        uid: null,
        loaded: false,
    },
})
export class AuthState implements NgxsOnInit {
    /**
     * Selectors
     */
    @Selector()
    static getUid(state: AuthStateModel) {
        return state.uid || null;
    }

    constructor(
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
                    console.log(user);
                    console.log(`CheckSession: ${user.displayName} is logged in`);
                    setTimeout(() => {
                        sc.dispatch(new LoginSuccessAction(user.uid));
                    }, 10);
                    return;
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
        await this.auth.signInWithEmail(action.email, action.password).then(data => {
            setTimeout(() => {
                sc.dispatch(new LoginSuccessAction(data.user.uid));
            }, 10);
        }, error => {
            setTimeout(() => {
                this.toast.show('[T]Email o Password son incorrectos', 'danger');
                sc.dispatch(new LoginFailedAction(error));
            }, 10);
        });
    }

    @Action(LogoutAction)
    async logout(sc: StateContext<AuthStateModel>) {
        await this.afAuth.auth.signOut().then(() => {
            setTimeout(() => {
                sc.dispatch(new LogoutSuccessAction());
            }, 10);
        });
    }

    @Action(LoginSuccessAction)
    onLoginSuccess(sc: StateContext<AuthStateModel>, action: LoginSuccessAction) {
        const state = sc.getState();
        sc.setState({
            ...state,
            uid: action.uid,
            loaded: true,
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
                    // TODO: bug when I want to get favorites, look like uid is not stored in LoginSuccessAction
                    sc.setState({
                        ...state,
                        uid: data.user.uid,
                        loaded: true,
                    });
                    sc.dispatch(new LoginSuccessAction(data.user.uid));
                }, 10);
            }
        }, error => {
            setTimeout(() => {
                this.toast.show('[T]El usuario de facebook esta fallando', 'danger');
                sc.dispatch(new LoginFailedAction(error));
            }, 10);
        });
    }

    /**********************************
     * REGISTER
     *********************************/
    @Action(RegisterWithEmailAndPasswordAction)
    async registerWithEmailAndPassword(sc: StateContext<AuthStateModel>, action: RegisterWithEmailAndPasswordAction) {
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
                this.toast.show('[T]No puedes registrarte con estos datos', 'danger');
                sc.dispatch(new RegisterFailedAction(error));
            }, 10);
        });
    }

    @Action(RegisterSuccessAction)
    registerSuccess(sc: StateContext<AuthStateModel>, action: RegisterSuccessAction) {
        console.log('registerSuccess, navigating to /dashboard ', action.user.uid);
        const state = sc.getState();
        sc.setState({
            ...state,
            uid: action.user.uid,
            loaded: true,
        });
        setTimeout(() => {
            sc.dispatch(new SetUserAction(action.user));
        }, 10);
    }
    @Action([LoginFailedAction, LogoutSuccessAction, RegisterFailedAction])
    resetAuthState(sc: StateContext<AuthStateModel>) {
        sc.setState({
            uid: null,
            loaded: true
        });
    }


}
