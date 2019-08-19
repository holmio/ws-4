import { Action, Selector, State, StateContext, Store } from '@ngxs/store';

import {
    GetChatAction,
    GetChatSuccessAction,
    GetChatFailedAction,
    SendMessageAction,
    SendMessageSuccessAction,
    SendMessageFailedAction,
    SetChatAction,
    SetChatSuccessAction,
    SetChatFailedAction,
} from './chat.actions';
import * as _ from 'lodash';
import { ChatStateModel, Message, Chat } from './chat.interface';
import { ChatService } from './chat.service';
import { UserState } from '../user';
import { ProductState } from '../product';

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

    /**
     * Selectors
     */
    @Selector()
    static getChat(state: ChatStateModel) {
        return state.chat || null;
    }
    // GET CHAT

    @Action(GetChatAction)
    async getChat(sc: StateContext<ChatStateModel>, action: GetChatAction) {
        const state = sc.getState();
        const userProduct = this.store.selectSnapshot(ProductState.getUserOfProduct);
        const product = this.store.selectSnapshot(ProductState.getProduct);
        const user = this.store.selectSnapshot(UserState.geUser);

        await this.chatService.getChat(action.uid).subscribe(data => {
            console.log(data);
            if (!data) {
                const chat: Chat = {
                    createdAt: this.timestamp,
                    messages: [],
                    ownerAvatar: userProduct.avatar,
                    productName: product.name,
                    uid: action.uid,
                    uidOwner: product.userUid,
                    uidProduct: product.uid,
                    uidVisitor: user.uid
                }
                setTimeout(() => {
                    return sc.dispatch(new SetChatAction(chat));
                }, 10);
            } else {
                setTimeout(() => {
                    sc.dispatch(new GetChatSuccessAction(data));
                }, 10);
            }
        }, error => {
            setTimeout(() => {
                sc.dispatch(new GetChatFailedAction(error));
            }, 10);
        });
    }

    @Action(GetChatSuccessAction)
    getChatSuccess(sc: StateContext<ChatStateModel>, action: GetChatSuccessAction) {
        const state = sc.getState();
        sc.setState({
            ...state,
            chat: action.chat,
            loaded: true,
        });
    }

    // SEND MESSAGE

    @Action(SendMessageAction)
    async sendMessage(sc: StateContext<ChatStateModel>, action: SendMessageAction) {
        const state = sc.getState();
        const user = this.store.selectSnapshot(UserState.geUser);
        const finalMessage: Message = {
            message: action.message,
            timestamp: this.timestamp,
            uid: user.uid,
        }
        await this.chatService.sendMessage(state.chat.uid, finalMessage).then(data => {
            setTimeout(() => {
                sc.dispatch(new SendMessageSuccessAction());
            }, 10);
        }, error => {
            setTimeout(() => {
                sc.dispatch(new SendMessageFailedAction(error));
            }, 10);
        });
    }

    // SET CHAT

    @Action(SetChatAction)
    async setChat(sc: StateContext<ChatStateModel>, action: SetChatAction) {
        const state = sc.getState();

        await this.chatService.create(action.chat).then(data => {
            setTimeout(() => {
                sc.dispatch(new SetChatSuccessAction(action.chat.uid));
            }, 10);
        }, error => {
            setTimeout(() => {
                sc.dispatch(new SetChatFailedAction(error));
            }, 10);
        });
    }

    @Action(SetChatSuccessAction)
    setChatSuccess(sc: StateContext<ChatStateModel>, action: SetChatSuccessAction) {
        const state = sc.getState();
        sc.dispatch(new GetChatAction(action.uid));
    }
}
