import {State, StateContext, Action, Selector, Select, NgxsOnInit} from '@ngxs/store';
import {ProductStateModel, Product} from './product.interface';
import {Observable} from 'rxjs';
import {AuthState} from '../auth';
import {filter, take} from 'rxjs/operators';
import {GetProductAction, GetProductSuccessAction, GetProductFailedAction} from './product.actions';
import {ProductService} from './product.service';

@State<ProductStateModel>({
    name: 'product',
    defaults: {
        product: null,
        loaded: false,
    },
})
export class ProductState implements NgxsOnInit {
    constructor(
        private productService: ProductService,
    ) {
    }

    @Select(AuthState.getUid) uid$: Observable<string | undefined>;
    private uidUser: string;

    ngxsOnInit(sc: StateContext<ProductStateModel>) {
        this.uid$.pipe(
            filter(data => !!data),
            take(1),
        ).subscribe((uid) => {
            this.uidUser = uid;
        });
    }


    /**
     * Selectors
     */
    @Selector()
    static getProduct(state: ProductStateModel) {
        return state.product || null;
    }

    @Action(GetProductAction)
    async getProduct(sc: StateContext<ProductStateModel>, action: GetProductAction) {
        const state = sc.getState();
        sc.setState({
            ...state,
            loaded: false,
        });
        await this.productService.getProduct(action.uid).subscribe(data => {
            console.log(data);
            sc.dispatch(new GetProductSuccessAction(data));
        }, error => {
            sc.dispatch(new GetProductFailedAction(error));
        });
    }

    @Action(GetProductSuccessAction)
    async getProductSuccess(sc: StateContext<ProductStateModel>, action: GetProductSuccessAction) {
        const state = sc.getState();
        sc.setState({
            ...state,
            product: action.product,
            loaded: true,
        });
    }

    @Action([GetProductFailedAction])
    setUserStateOnFailure(sc: StateContext<ProductStateModel>) {
        sc.setState({
            product: null,
            loaded: true
        });
    }
}
