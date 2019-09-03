import { GetSearchAction, GetSearchFailedAction, GetSearchSuccessAction } from './search.actions';
import { SearchStateModel } from './search.interface';
import { SearchService } from './search.service';
import { UserState } from '../user';
import {
    Action,
    Selector,
    State,
    StateContext,
    Store
    } from '@ngxs/store';
import * as _ from 'lodash';

@State<SearchStateModel>({
    name: 'search',
    defaults: {
        products: [],
        loading: false,
        loaded: false,
    },
})

export class SearchState {
    constructor(
        private searchService: SearchService,
        private store: Store,
    ) {

    }

    @Selector()
    static getSearchedProducts(state: SearchStateModel) {
        return state.products || null;
    }

    @Selector()
    static getLoading(state: SearchStateModel) {
        return state.loading || false;
    }

    @Action(GetSearchAction)
    getProducts(sc: StateContext<SearchStateModel>, action: GetSearchAction) {
        const state = sc.getState();
        const user = this.store.selectSnapshot(UserState.geUser);
        sc.setState({...state, loading: true});
        return this.searchService.getProducts(user && user.uid, action.filter).subscribe((products) => {
            setTimeout(() => {
                sc.dispatch(new GetSearchSuccessAction(products));
            }, 100);
        }, error => {
            setTimeout(() => {
                sc.dispatch(new GetSearchFailedAction(error));
            }, 10);
        });
    }

    @Action(GetSearchSuccessAction)
    getProductsSuccess(sc: StateContext<SearchStateModel>, action: GetSearchSuccessAction) {
        const state = sc.getState();
        sc.setState({
            ...state,
            products: action.products,
            loading: false,
            loaded: true,
        });
    }

    @Action(GetSearchFailedAction)
    reset(sc: StateContext<SearchStateModel>, action: GetSearchFailedAction) {
        const state = sc.getState();
        sc.setState({
            ...state,
            products: [],
            loading: false,
            loaded: false,
        });
    }

}
