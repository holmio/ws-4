import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Store, Select } from '@ngxs/store';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthState } from './auth.state';
import { ROUTE } from 'src/app/util/app.routes.const';

@Injectable()
export class AuthGuard implements CanActivate {

  @Select(AuthState.getUid) uid$: Observable<string | undefined>;

  constructor(
    private router: Router,
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.uid$.pipe(
      map(u => {
        if (!u) {
          this.router.navigate([ROUTE.login]);
        }
        return true;
      })
    );
  }
}