import {
    Action,
    NgxsOnInit,
    Selector,
    State,
    StateContext
    } from '@ngxs/store';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from './auth.service';
import {
    CheckSessionAction,
    LoginFailedAction,
    LoginSuccessAction,
    LoginWithEmailAndPasswordAction,
    LoginWithFacebookAction,
    LogoutAction,
    LogoutSuccessAction,
    RegisternFailedAction,
    RegisterSuccessAction,
    RegisterWithEmailAndPasswordAction
    } from './auth.actions';
import { GetUserAction, SetUserAction } from '../user/user.actions';
import { NgZone } from '@angular/core';
import { take, tap } from 'rxjs/operators';
import { User } from '../user/user.interface';
import { UserInfo } from 'firebase';

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

    constructor(
        private auth: AuthService,
        private afAuth: AngularFireAuth,
    ) {
    }

    /**
    * Dispatch CheckSession on start
    */
    ngxsOnInit(sc: StateContext<AuthStateModel>) {
        sc.dispatch(new CheckSessionAction());
    }

    /**
     * Selectors
     */
    @Selector()
    static getUid(state: AuthStateModel) {
        return state.uid || null;
    }


    @Action(CheckSessionAction)
    checkSession(sc: StateContext<AuthStateModel>) {
        return this.afAuth.authState.pipe(
            take(1),
            tap((user: UserInfo) => {
                if (user) {
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
                console.log('CheckSession: no user found');
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
                sc.dispatch(new LoginFailedAction(error));
            }, 10);
        });
    }

    @Action(LogoutAction)
    async logout(sc: StateContext<AuthStateModel>) {
        return this.afAuth.auth.signOut().then(() => {
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
        await this.auth.signInWithFacebook().then(data => {
            console.log(data);
            // If the user is new, we create a new account
            if (data.additionalUserInfo.isNewUser) {
                const userInformation: User = {
                    uid: data.user.uid,
                    name: data.user.displayName,
                    lastSignInTime: null,
                    avatar: data.user.photoUR,
                    email: data.user.email,
                    favorites: [],
                };
                setTimeout(() => {
                    sc.dispatch(new SetUserAction(userInformation));
                }, 10);
            } else {
                setTimeout(() => {
                    sc.dispatch(new LoginSuccessAction(data.user.uid));
                }, 10);
            }
        }, error => {
            setTimeout(() => {
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
                lastSignInTime: null,
                avatar: '../../assets/images/default-avatar.png',
                email: data.user.email,
            };
            setTimeout(() => {
                sc.dispatch(new RegisterSuccessAction(userInformation));
            }, 10);
        }, error => {
            setTimeout(() => {
                sc.dispatch(new RegisternFailedAction(error));
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
    @Action([LoginFailedAction, LogoutSuccessAction, RegisternFailedAction])
    resetAuthState(sc: StateContext<AuthStateModel>) {
        sc.setState({
            uid: null,
            loaded: true
        });
    }


}