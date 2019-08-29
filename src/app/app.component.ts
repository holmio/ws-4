import { Component, OnInit } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Store, Select } from '@ngxs/store';
import { UserState, User } from './store/user';
import { Router } from '@angular/router';
import { LogoutAction } from './store/auth';
import * as moment from 'moment';
import * as locales from 'moment/min/locales';
import { FirebaseMessaging } from '@ionic-native/firebase-messaging/ngx';

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
      this.fMessaging.requestPermission().then((data) => console.log('Permission ', data));
      this.fMessaging.getToken().then((data) => console.log('Token ', data));
      this.fMessaging.onMessage().subscribe((data) => console.log('Message ', data));
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
