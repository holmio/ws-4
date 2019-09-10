import { LoginSuccessAction, LogoutAction, LogoutSuccessAction } from './store/auth';
import { User, UserState } from './store/user';
import { UserService } from './store/user/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseMessaging } from '@ionic-native/firebase-messaging/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import {
  Actions,
  ofActionSuccessful,
  Select,
  Store
  } from '@ngxs/store';
import * as moment from 'moment';
import * as locales from 'moment/min/locales';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app-component.scss']
})
export class AppComponent implements OnInit {
  @Select(UserState.geUser) user$: Observable<User>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private router: Router,
    private store: Store,
    private menu: MenuController,
    private translate: TranslateService,
    private statusBar: StatusBar,
    private fMessaging: FirebaseMessaging,
    private actions: Actions,
    private userService: UserService,
  ) {
    this.initializeApp();
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('es');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use('es');
    moment.locale('es');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#DB3A34');
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      if (this.platform.is('cordova')) {
        this.fMessaging.getToken().then((data) => console.log('Token ', data));
        this.fMessaging.onMessage().subscribe((data) => console.log('Message ', data));
      }
    });
  }

  ngOnInit(): void {
    moment.locale('es', {
      calendar: {
        sameDay: '[Hoy]',
        nextDay: '[Mañana]',
        nextWeek: 'dddd',
        lastDay: '[Ayer]',
        lastWeek: 'dddd [Semana pasada]',
        sameElse: 'L'
      },
    });

    if (this.platform.is('cordova')) {
      this.actions.pipe(
        ofActionSuccessful(LogoutSuccessAction),
      ).subscribe(async () => {
        await this.fMessaging.revokeToken();
      });

      this.actions.pipe(
        ofActionSuccessful(LoginSuccessAction),
      ).subscribe(async (action) => {
        this.fMessaging.requestPermission();
        const token = await this.fMessaging.getToken();
        await this.userService.updateTokenDevice(action.uid, token);
      });
    }
  }

  goToPage(url: string) {
    this.menu.close();
    if (url === 'logout') {
      this.store.dispatch(new LogoutAction());
    } else {
      this.router.navigateByUrl(url);
    }
  }
}
