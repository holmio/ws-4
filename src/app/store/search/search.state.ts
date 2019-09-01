import { Action, Selector, State, StateContext, Store } from '@ngxs/store';


import * as _ from 'lodash';
import { ProductsStateModel } from './search.interface';
import { SearchService } from './search.service';

@State<ProductsStateModel>({
    name: 'products',
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
    static getAllProducts(state: ProductsStateModel) {
        return state.products || null;
    }

    
}
