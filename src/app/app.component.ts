import { Component, OnInit } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Store, Select } from '@ngxs/store';
import { UserState } from './store/user';
import { UserDetail } from './store/user/user.interface';
import { Router } from '@angular/router';
import { LogoutAction } from './store/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app-component.scss']
})
export class AppComponent implements OnInit {
  private items: Observable<any>;
  @Select(UserState.geUser) user$: Observable<UserDetail | undefined>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private router: Router,
    private store: Store,
    private menu: MenuController,
    private translate: TranslateService,
    private db: AngularFirestore,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them 
    translate.use('en');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.items = this.db.collection('users').valueChanges();
      this.items.subscribe(user => console.log(user));
    });
  }

  ngOnInit(): void {
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
