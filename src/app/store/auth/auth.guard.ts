import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Store, Select } from '@ngxs/store';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthState } from './auth.state';
import { ROUTE } from 'src/app/util/app.routes.const';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private store: Store
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const uid = this.store.selectSnapshot(AuthState.getUid);
    if (!uid) {
      this.router.navigate([ROUTE.login]);
      return false;
    }
    return true;
  }
}
