import { NetworkConnectedAction, NetworkDisconnectAction } from './network.actions';
import { Network } from '@ionic-native/network/ngx';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ToastService } from 'src/app/services/toast/toast.services';

export interface NetworkStateModel {
    connected: boolean;
}
@State<NetworkStateModel>({
    name: 'network',
    defaults: {
        connected: true,
    },
})
export class NetworkState {

    constructor(
        private network: Network,
        private toast: ToastService,
    ) {
    }

    /**
     * Selectors
     */
    @Selector()
    static geNetworkStatus(state: NetworkStateModel) {
        return state.connected;
    }

    @Action(NetworkConnectedAction)
    networkSuccess(sc: StateContext<NetworkStateModel>) {
        const state = sc.getState();
        sc.setState({
            ...state,
            connected: true,
        });
    }

    @Action(NetworkDisconnectAction)
    networkFailed(sc: StateContext<NetworkStateModel>) {
        const state = sc.getState();
        sc.setState({
            ...state,
            connected: false,
        });
    }
}
