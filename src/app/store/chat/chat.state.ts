import { Action, Selector, State, StateContext, Store } from '@ngxs/store';

import {
    GetProductsAction,
    GetProductsSuccessAction,
    GetProductsFailedAction,
} from './chat.actions';
import * as _ from 'lodash';
import { ProductService } from '../product/product.service';
import { UserState } from '../user';
import { ChatStateModel } from './chat.interface';

@State<ChatStateModel>({
    name: 'products',
    defaults: {
        messages: [],
        loaded: false,
    },
})

export class ChatState {
    constructor(
        private store: Store,
    ) {

    }

   
}
