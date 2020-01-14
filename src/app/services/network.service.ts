import { Inject, Injectable } from '@angular/core';
import { fromEvent, merge, Observable, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class NetworkService {

    private online$: Observable<boolean>;

    constructor(
        @Inject('window') private window: Window
    ) {

        this.online$ = merge(of(this.window.navigator.onLine),
            fromEvent(this.window, 'online').pipe(mapTo(true)),
            fromEvent(this.window, 'offline').pipe(mapTo(false))
        );
    }

    getNetworkStatus(): Observable<boolean> {
        return this.online$;
    }
}
