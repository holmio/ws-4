import { State, StateContext, Action, Selector } from '@ngxs/store';
import { UserDetail, UserStateModel } from '../user/user.interface';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { GetUserAction, GetUserSuccessAction, GetUserFailedAction, SetUserAction, SetUserSuccessAction, SetUserFailedAction } from './user.actions';
import { LogoutSuccessAction, LoginSuccessAction } from '../auth';

@State<UserStateModel>({
    name: 'user',
    defaults: {
        user: null,
        loaded: false,
    },
})
export class UserState {

    private userCollectionRef: AngularFirestoreCollection<any>;
    
    constructor(
        private afStore: AngularFirestore,
    ) {
        this.userCollectionRef = this.afStore.collection<UserDetail>('users');
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
        this.userCollectionRef.doc(action.uid).valueChanges().subscribe((user: UserDetail) => {
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
    @Action([GetUserFailedAction])
    getUserFailure(sc: StateContext<UserStateModel>) {
        sc.setState({
            user: null,
            loaded: true
        });
    }

    @Action(SetUserAction)
    setUserData(sc: StateContext<UserStateModel>, action: SetUserAction) {
        const uid = action.user.uid;
        console.log(action.user);
        this.userCollectionRef.doc(uid).set(action.user).then((data) => {
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
    setUserFailure(sc: StateContext<UserStateModel>) {
        sc.setState({
            user: null,
            loaded: false
        });
    }
}