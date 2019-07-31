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
    LoginRedirectAction,
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
import { ROUTE } from 'src/app/util/app.routes.const';
import { Router } from '@angular/router';
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
        private zone: NgZone,
        private router: Router,
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
        return state.uid || '';
    }


    @Action(CheckSessionAction)
    checkSession(sc: StateContext<AuthStateModel>) {
        return this.afAuth.authState.pipe(
            take(1),
            tap((user: UserInfo) => {
                if (user) {
                    console.log(`CheckSession: ${user.displayName} is logged in`);
                    sc.dispatch(new LoginSuccessAction(user.uid));
                    return;
                } else {
                    sc.dispatch(new LoginFailedAction('CheckSession: no user found'));
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
            console.log(data);
            sc.dispatch(new LoginSuccessAction(data.user.uid));
        }, error => {
            sc.dispatch(new LoginFailedAction(error));
        });
    }

    @Action(LogoutAction)
    async logout(sc: StateContext<AuthStateModel>) {
        return this.afAuth.auth.signOut().then(() => {
            sc.dispatch(new LogoutSuccessAction());
        });
    }

    @Action(LoginRedirectAction)
    onLoginRedirect(sc: StateContext<AuthStateModel>) {
        console.log('onLoginRedirect, navigating to /auth/login');
        this.zone.run(() => {
            this.router.navigate([ROUTE.login]);
        });
    }

    @Action(LoginSuccessAction)
    onLoginSuccess(sc: StateContext<AuthStateModel>, action: LoginSuccessAction) {
        console.log('onLoginSuccess, navigating to /dashboard ', action.uid);
        const state = sc.getState();
        sc.setState({
            ...state,
            uid: action.uid,
            loaded: true,
        });
        sc.dispatch(new GetUserAction(action.uid));
        this.zone.run(() => {
            // this.router.navigate([ROUTE.home]);
        });
    }
    @Action(LogoutSuccessAction)
    onLogoutSuccessAction(sc: StateContext<AuthStateModel>) {
        this.zone.run(() => {
            this.router.navigate([ROUTE.home]);
        });
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
                sc.dispatch(new SetUserAction(userInformation));
            } else {
                sc.dispatch(new LoginSuccessAction(data.user.uid));
            }
        }, error => {
            sc.dispatch(new LoginFailedAction(error));
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
            }
            sc.dispatch(new RegisterSuccessAction(userInformation));
        }, error => {
            sc.dispatch(new RegisternFailedAction(error));
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
        sc.dispatch(new SetUserAction(action.user));
        sc.dispatch(new LoginRedirectAction());
    }
    @Action([LoginFailedAction, LogoutSuccessAction, RegisternFailedAction])
    resetAuthState(sc: StateContext<AuthStateModel>) {
        sc.setState({
            uid: null,
            loaded: true
        });
    }


}