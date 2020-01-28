import { Channel, ChatStateModel, Message } from './chat.interface';
import { ChatService } from './chat.service';
import { LoginFailedAction, LogoutSuccessAction } from '../auth';
import { ProductState } from '../product';
import { UserState } from '../user';
import { TranslateService } from '@ngx-translate/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import * as _ from 'lodash';
import { ToastService } from 'src/app/services/toast/toast.services';
import { timestamp } from 'src/app/util/common';

import {
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
    DistroyChatAction,
} from './chat.actions';

@State<ChatStateModel>({
    name: 'chat',
    defaults: {
        channel: null,
        channels: [],
        loaded: false,
        loading: false,
    },
})

export class ChatState {

    constructor(
        private translate: TranslateService,
        private store: Store,
        private toast: ToastService,
        private chatService: ChatService,
    ) {

    }

    /**
     * Selectors
     */
    @Selector()
    public static loading(state: ChatStateModel) {
      return state.loading;
    }
    @Selector()
    static getChannels(state: ChatStateModel) {
        return state.channels || null;
    }
    @Selector()
    static getChannel(state: ChatStateModel) {
        return state.channel || null;
    }

    // SEND MESSAGE

    @Action(SendMessageAction)
    async sendMessage(sc: StateContext<ChatStateModel>, action: SendMessageAction) {
        const state = sc.getState();
        const user = this.store.selectSnapshot(UserState.geUser);
        const finalMessage: Message = {
            message: action.message,
            timestamp: timestamp(),
            uid: user.uid,
        };
        sc.patchState({loading: true});

        await this.chatService.sendMessage(state.channel.uid, finalMessage).then(data => {
            setTimeout(() => {
                sc.dispatch(new SendMessageSuccessAction());
            }, 10);
        }, error => {
            setTimeout(() => {
                this.toast.show({message: this.translate.instant('chat.toast.send-message.error'), color: 'danger'});
                sc.dispatch(new SendMessageFailedAction(error));
            }, 10);
        });
    }

    // SET CHANNEL

    @Action(SetChannelAction)
    async setChannel(sc: StateContext<ChatStateModel>, action: SetChannelAction) {
        const state = sc.getState();
        const user = this.store.selectSnapshot(UserState.geUser);
        sc.patchState({loading: true});
        const message: Message = {
            message: action.message,
            timestamp: timestamp(),
            uid: user.uid,
        };

        await this.chatService.createChannel(message, state.channel).then(data => {
            setTimeout(() => {
                sc.dispatch(new SetChannelSuccessAction(state.channel));
            }, 10);
        }, error => {
            setTimeout(() => {
                this.toast.show({message: this.translate.instant('chat.toast.create-channel.error'), color: 'danger'});
                sc.dispatch(new SetChannelFailedAction(error));
            }, 10);
        });
    }

    @Action(SetChannelSuccessAction)
    setChannelSuccess(sc: StateContext<ChatStateModel>, action: SetChannelSuccessAction) {
        sc.patchState({loading: false});
        sc.dispatch(new GetChannelAction(action.channel.uid));
    }

    // GET CHANNELS LIST

    @Action(GetChannelsAction)
    getChannels(sc: StateContext<ChatStateModel>) {
        sc.patchState({loading: true});
        const user = this.store.selectSnapshot(UserState.geUser);
        return this.chatService.getChannels(user.uid).subscribe(data => {
            setTimeout(() => {
                sc.dispatch(new GetChannelsSuccessAction(data));
            }, 10);
        }, error => {
            setTimeout(() => {
                this.toast.show({message: this.translate.instant('chat.toast.get-channels.error'), color: 'danger'});
                sc.dispatch(new GetChannelsFailedAction(error));
            }, 10);
        });
    }

    @Action(GetChannelsSuccessAction)
    getChannelsSuccess(sc: StateContext<ChatStateModel>, action: GetChannelsSuccessAction) {
        sc.patchState({
            channels: action.channels,
            loaded: true,
            loading: false,
        });
    }

    // GET CHANNEL

    @Action(GetChannelAction)
    getChannel(sc: StateContext<ChatStateModel>, action: GetChannelAction) {
        const user = this.store.selectSnapshot(UserState.geUser);
        const product = this.store.selectSnapshot(ProductState.getProduct);
        const userProduct = this.store.selectSnapshot(ProductState.getUserOfProduct);
        sc.patchState({loading: true});

        return this.chatService.getChannel(action.uid).subscribe(channel => {
            if (channel) {
                setTimeout(() => {
                    sc.dispatch(new GetChannelSuccessAction(channel));
                }, 10);
            } else {
                const uidChannel = user.uid + product.uid;
                const newChannel: Channel = {
                    uid: uidChannel,
                    createdAt: timestamp(),
                    timestamp: timestamp(),
                    lastMessage: '',
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
                sc.patchState({
                    channel: newChannel,
                    loaded: true,
                    loading: false
                });
                setTimeout(() => {
                    sc.dispatch(new GetChannelFailedAction(false));
                }, 10);
            }
        }, error => {
            setTimeout(() => {
                this.toast.show({message: this.translate.instant('chat.toast.get-channel.error'), color: 'danger'});
                sc.dispatch(new GetChannelFailedAction(error));
            }, 10);
        });
    }

    @Action(GetChannelSuccessAction)
    getChannelSuccess(sc: StateContext<ChatStateModel>, action: GetChannelSuccessAction) {
        sc.patchState({
            channel: action.channel,
            loaded: true,
            loading: false,
        });
    }


    // UPDATE CHANNEL

    @Action(UpdateChannelAction)
    UpdateChannel(sc: StateContext<ChatStateModel>) {
        const state = sc.getState();
        sc.patchState({loading: true});
        const user = this.store.selectSnapshot(UserState.geUser);
        const isVisitor = user.uid === state.channel.visitor.uid;
        return this.chatService.updateChannel(state.channel, isVisitor).subscribe(data => {
            setTimeout(() => {
                sc.dispatch(new UpdateChannelSuccessAction());
            }, 10);
        }, error => {
            setTimeout(() => {
                this.toast.show({message: this.translate.instant('chat.toast.update-channel.error'), color: 'danger' });
                sc.dispatch(new UpdateChannelFailedAction(error));
            }, 10);
        });
    }

    // RESET CHAT

    @Action([UpdateChannelSuccessAction, UpdateChannelFailedAction])
    updateChannelSuccessStatus(sc: StateContext<ChatStateModel>) {
        sc.patchState({loading: false});
    }

    @Action([DistroyChatAction])
    resetChannelStatus(sc: StateContext<ChatStateModel>) {
        sc.patchState({
            channel: null,
        });
    }

    @Action([LogoutSuccessAction, LoginFailedAction])
    resetChatStatus(sc: StateContext<ChatStateModel>) {
        const state = sc.getState();
        sc.setState({
            ...state,
            channel: null,
            channels: [],
            loaded: false,
            loading: false,
        });
    }
}
