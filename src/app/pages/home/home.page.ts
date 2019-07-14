import { Component } from '@angular/core';
import { AuthService } from 'src/app/store/auth/auth.service';
import { LoginWithEmailAndPasswordAction, LogoutAction } from 'src/app/store/auth';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private store: Store, private router: Router) {
  }

  login() {
  }

}
