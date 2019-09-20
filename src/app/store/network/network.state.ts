import {
    ConnectNetworkAction,
    DisconnectNetworkAction,
    NetworkFailedAction,
    NetworkSuccessAction
    } from './network.actions';
import { Network } from '@ionic-native/network/ngx';
import {
    Action,
    NgxsOnInit,
    Selector,
    State,
    StateContext
    } from '@ngxs/store';
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
export class NetworkState implements NgxsOnInit {

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

    ngxsOnInit(sc: StateContext<NetworkStateModel>) {
        sc.dispatch(new ConnectNetworkAction());
        sc.dispatch(new DisconnectNetworkAction());
    }

    @Action(ConnectNetworkAction)
    getNetwork(sc: StateContext<NetworkStateModel>) {
        const state = sc.getState();
        return this.network.onConnect().subscribe(() => {
            console.log('network connected!');
            // We just got a connection but we need to wait briefly
             // before we determine the connection type. Might need to wait.
            // prior to doing any api requests as well.
            setTimeout(() => {
                sc.dispatch(new NetworkSuccessAction());
            }, 3000);
          });
    }

    @Action(DisconnectNetworkAction)
    getDisconnectNetwork(sc: StateContext<NetworkStateModel>) {
        const state = sc.getState();
        return this.network.onDisconnect().subscribe(() => {
            console.log('network was disconnected :-(');
            sc.dispatch(new NetworkFailedAction());
          });
    }

    @Action(NetworkSuccessAction)
    networkSuccess(sc: StateContext<NetworkStateModel>) {
        const state = sc.getState();
        sc.setState({
            ...state,
            connected: true,
        });
    }

    @Action(NetworkFailedAction)
    networkFailed(sc: StateContext<NetworkStateModel>) {
        const state = sc.getState();
        sc.setState({
            ...state,
            connected: false,
        });
    }


}
