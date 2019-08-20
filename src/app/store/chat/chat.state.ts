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
    GetChatsDetailAction,
    GetChatsDetailSuccessAction,
    GetChatsDetailFailedAction,
} from './chat.actions';
import * as _ from 'lodash';
import { ChatStateModel, Message, Chat } from './chat.interface';
import { ChatService } from './chat.service';
import { UserState } from '../user';
import { ProductState } from '../product';
import { LogoutSuccessAction, LoginFailedAction } from '../auth';

@State<ChatStateModel>({
    name: 'chat',
    defaults: {
        chat: null,
        chatsDetail: [],
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
    @Selector()
    static getChatsDetail(state: ChatStateModel) {
        return state.chatsDetail || null;
    }
    // GET CHAT

    @Action(GetChatAction)
    async getChat(sc: StateContext<ChatStateModel>, action: GetChatAction) {
        const state = sc.getState();
        await this.chatService.getChat(action.uid).subscribe(data => {
            console.log(data);
            if (!data) {
                setTimeout(() => {
                    sc.dispatch(new SetChatAction(action.uid));
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
        };
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
        const userProduct = this.store.selectSnapshot(ProductState.getUserOfProduct);
        const product = this.store.selectSnapshot(ProductState.getProduct);
        const user = this.store.selectSnapshot(UserState.geUser);
        const chat: Chat = {
            createdAt: this.timestamp,
            messages: [],
            productName: product.name,
            uid: action.uid,
            uidUser: product.userUid,
            userAvatar: userProduct.avatar,
            uidProduct: product.uid,
            members: {
                [user.uid]: true,
                [product.userUid]: true,
            }
        };
        await this.chatService.create(chat).then(data => {
            setTimeout(() => {
                sc.dispatch(new SetChatSuccessAction(chat));
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
        sc.setState({
            ...state,
            chat: action.chat,
            loaded: true,
        });
    }

    // GET CHATS DETAIL

    @Action(GetChatsDetailAction)
    async getChatsDetail(sc: StateContext<ChatStateModel>) {
        const state = sc.getState();
        const user = this.store.selectSnapshot(UserState.geUser);
        await this.chatService.getChatsDetail(user.uid).subscribe(data => {
            setTimeout(() => {
                sc.dispatch(new GetChatsDetailSuccessAction(data));
            }, 10);
        }, error => {
            setTimeout(() => {
                sc.dispatch(new GetChatsDetailFailedAction(error));
            }, 10);
        });
    }

    @Action(GetChatsDetailSuccessAction)
    getChatsDetailSuccess(sc: StateContext<ChatStateModel>, action: GetChatsDetailSuccessAction) {
        const state = sc.getState();
        sc.setState({
            ...state,
            chatsDetail: action.chatsDetail,
            loaded: true,
        });
    }

    @Action([LogoutSuccessAction, LoginFailedAction])
    resetChatStatus(sc: StateContext<ChatStateModel>) {
        const state = sc.getState();
        sc.setState({
            ...state,
            chat: null,
            chatsDetail: [],
            loaded: false,
        });
    }
}
