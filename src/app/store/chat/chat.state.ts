import { Action, Selector, State, StateContext, Store } from '@ngxs/store';

import {
    GetChatAction,
    GetChatSuccessAction,
    GetChatFailedAction,
    SendMessageAction,
    SendMessageSuccessAction,
    SendMessageFailedAction,
    SetChannelAction,
    SetChannelSuccessAction,
    SetChannelFailedAction,
    GetChannelsAction,
    GetChannelsSuccessAction,
    GetChannelsFailedAction,
    GetChannelSuccessAction,
    GetChannelFailedAction,
    GetChannelAction,
    UpdateChannelAction,
    UpdateChannelSuccessAction,
    UpdateChannelFailedAction,
} from './chat.actions';
import * as _ from 'lodash';
import { ChatStateModel, Message, Chat, Channel } from './chat.interface';
import { ChatService } from './chat.service';
import { UserState } from '../user';
import { ProductState } from '../product';
import { LogoutSuccessAction, LoginFailedAction } from '../auth';

@State<ChatStateModel>({
    name: 'chat',
    defaults: {
        chat: null,
        channel: null,
        channels: [],
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
    static getChannels(state: ChatStateModel) {
        return state.channels || null;
    }
    @Selector()
    static getChannel(state: ChatStateModel) {
        return state.channel || null;
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

        await this.chatService.sendMessage(state.channel.uid, finalMessage).then(data => {
            setTimeout(() => {
                sc.dispatch(new SendMessageSuccessAction());
            }, 10);
        }, error => {
            setTimeout(() => {
                sc.dispatch(new SendMessageFailedAction(error));
            }, 10);
        });
    }

    // SET CHANNEL

    @Action(SetChannelAction)
    async setChannel(sc: StateContext<ChatStateModel>, action: SetChannelAction) {
        const state = sc.getState();
        const user = this.store.selectSnapshot(UserState.geUser);
        const product = this.store.selectSnapshot(ProductState.getProduct);
        const userProduct = this.store.selectSnapshot(ProductState.getUserOfProduct);

        const uidChannel = user.uid + product.uid;
        const finalMessage: Message = {
            message: action.message,
            timestamp: this.timestamp,
            uid: user.uid,
        };
        const chat: Chat = {
            messages: [finalMessage],
        };
        const newChannel: Channel = {
            uid: uidChannel,
            createdAt: this.timestamp,
            timestamp: this.timestamp,
            lastMessage: action.message,
            product: {
                uid: product.uid,
                name: product.name,
                avatar: product.avatar,
            },
            members: {
                [user.uid]: true,
                [userProduct.uid]: true,
            },
            visitor: {
                lastConnection: user.lastConnection,
                name: user.name,
                avatar: user.avatar,
                uid: user.uid,
            },
            owner: {
                lastConnection: userProduct.lastConnection,
                name: userProduct.name,
                avatar: userProduct.avatar,
                uid: userProduct.uid,
            }
        };
        await this.chatService.createChannel(chat, newChannel).then(data => {
            setTimeout(() => {
                sc.dispatch(new SetChannelSuccessAction(chat, newChannel));
            }, 10);
        }, error => {
            setTimeout(() => {
                sc.dispatch(new SetChannelFailedAction(error));
            }, 10);
        });
    }

    @Action(SetChannelSuccessAction)
    setChannelSuccess(sc: StateContext<ChatStateModel>, action: SetChannelSuccessAction) {
        const state = sc.getState();
        sc.setState({
            ...state,
            channel: action.channel,
            chat: action.chat,
            loaded: true,
        });
    }

    // GET CHANNELS LIST

    @Action(GetChannelsAction)
    async getChannels(sc: StateContext<ChatStateModel>) {
        const state = sc.getState();
        const user = this.store.selectSnapshot(UserState.geUser);
        await this.chatService.getChannels(user.uid).subscribe(data => {
            setTimeout(() => {
                sc.dispatch(new GetChannelsSuccessAction(data));
            }, 10);
        }, error => {
            setTimeout(() => {
                sc.dispatch(new GetChannelsFailedAction(error));
            }, 10);
        });
    }

    @Action(GetChannelsSuccessAction)
    getChannelsSuccess(sc: StateContext<ChatStateModel>, action: GetChannelsSuccessAction) {
        const state = sc.getState();
        sc.setState({
            ...state,
            channels: action.channels,
            loaded: true,
        });
    }

    // GET CHANNEL

    @Action(GetChannelAction)
    async getChannel(sc: StateContext<ChatStateModel>, action: GetChannelAction) {
        const state = sc.getState();
        const user = this.store.selectSnapshot(UserState.geUser);
        await this.chatService.getChannel(action.uid).subscribe(data => {
            setTimeout(() => {
                sc.dispatch(new GetChannelSuccessAction(data));
            }, 10);
        }, error => {
            setTimeout(() => {
                sc.dispatch(new GetChannelFailedAction(error));
            }, 10);
        });
    }

    @Action(GetChannelSuccessAction)
    getChannelSuccess(sc: StateContext<ChatStateModel>, action: GetChannelSuccessAction) {
        const state = sc.getState();
        sc.setState({
            ...state,
            channel: action.channel,
            loaded: true,
        });
        setTimeout(() => {
            sc.dispatch(new UpdateChannelAction());
        }, 10);
    }


    // UPDATE CHANNEL

    @Action(UpdateChannelAction)
    async UpdateChannel(sc: StateContext<ChatStateModel>) {
        const state = sc.getState();
        const user = this.store.selectSnapshot(UserState.geUser);
        const isVisitor = user.uid === state.channel.visitor.uid;
        await this.chatService.updateChannel(state.channel, isVisitor).subscribe(data => {
            setTimeout(() => {
                sc.dispatch(new UpdateChannelSuccessAction());
            }, 10);
        }, error => {
            setTimeout(() => {
                sc.dispatch(new UpdateChannelFailedAction(error));
            }, 10);
        });
    }

    @Action(UpdateChannelSuccessAction)
    UpdateChannelSuccess(sc: StateContext<ChatStateModel>, action: UpdateChannelSuccessAction) {
        const state = sc.getState();
        setTimeout(() => {
            // sc.dispatch(new GetChannelAction(state.channel.uid));
        }, 10);
    }

    // RESET CHAT

    @Action([LogoutSuccessAction, LoginFailedAction])
    resetChatStatus(sc: StateContext<ChatStateModel>) {
        const state = sc.getState();
        sc.setState({
            ...state,
            chat: null,
            channels: [],
            loaded: false,
        });
    }
}
