import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import * as _ from 'lodash';
import { SearchStateModel } from './search.interface';
import { SearchService } from './search.service';
import { GetSearchAction, GetSearchSuccessAction, GetSearchFailedAction } from './search.actions';
import { UserState } from '../user';

@State<SearchStateModel>({
    name: 'search',
    defaults: {
        products: [],
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

    @Action(GetSearchAction)
    getProducts(sc: StateContext<SearchStateModel>, action: GetSearchAction) {
        const state = sc.getState();
        const user = this.store.selectSnapshot(UserState.geUser);
        return this.searchService.getProducts(user && user.uid, action.filter.name).subscribe((products) => {
            setTimeout(() => {
                sc.dispatch(new GetSearchSuccessAction(products));
            }, 10);
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
            loaded: true,
        });
    }

}
