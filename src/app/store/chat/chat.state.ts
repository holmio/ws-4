import { Action, Selector, State, StateContext, Store } from '@ngxs/store';

import {
    GetChatAction,
    GetChatSuccessAction,
    GetChatFailedAction,
} from './chat.actions';
import * as _ from 'lodash';
import { ChatStateModel } from './chat.interface';
import { ChatService } from './chat.service';

@State<ChatStateModel>({
    name: 'chat',
    defaults: {
        chat: null,
        loaded: false,
    },
})

export class ChatState {
    constructor(
        private store: Store,
        private chatService: ChatService,
    ) {

    }

    // Firebase Server Timestamp
    get timestamp() {
        return new Date().getTime();
    }

    // GET CHAT

    @Action(GetChatAction)
    async getChat(sc: StateContext<ChatStateModel>, action: GetChatAction) {
        const state = sc.getState();
        await this.chatService.getChat(action.uid).subscribe(data => {
            setTimeout(() => {
                sc.dispatch(new GetChatSuccessAction(data));
            }, 10);
        }, error => {
            setTimeout(() => {
                sc.dispatch(new GetChatFailedAction(error));
            }, 10);
        });
    }
}
