import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store, Select } from '@ngxs/store';

import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { AuthState } from './auth.state';
import { LoginRedirectAction } from './auth.actions';

@Injectable()
export class AuthGuard implements CanActivate {

  @Select(AuthState.getUid) uid$: Observable<string | undefined>;

  constructor(private store: Store) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.uid$.pipe(
      filter(data => !!data),
      map(u => {
        if (!u) {
          this.store.dispatch(new LoginRedirectAction());
        }
        return true;
      })
    );
  }
}