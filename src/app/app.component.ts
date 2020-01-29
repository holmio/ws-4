import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseDynamicLinks } from '@ionic-native/firebase-dynamic-links/ngx';
import { FirebaseMessaging } from '@ionic-native/firebase-messaging/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Actions, ofActionSuccessful, Select, Store } from '@ngxs/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { NetworkService } from './services/network.service';
import { LocalStorageService } from './services/storage.service';
import { MyToastOption, ToastService } from './services/toast/toast.services';
import { LoginSuccessAction, LogoutAction, LogoutSuccessAction } from './store/auth';
import { Channel, ChatState } from './store/chat';
import { NetworkConnectedAction, NetworkDisconnectAction } from './store/network';
import { NetworkState } from './store/network/network.state';
import { User, UserState } from './store/user';
import { UserService } from './store/user/user.service';
import { APP_CONST } from './util/app.constants';
import { ROUTE } from './util/app.routes.const';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app-component.scss']
})
export class AppComponent implements OnInit {
  currentLang;
  directionLang = 'ltr';
  isLangSpanish = true;
  @Select(UserState.geUser) user$: Observable<User>;
  @Select(NetworkState.geNetworkStatus) networkStatus$: Observable<boolean>;
  @Select(ChatState.getChannel) channel$: Observable<Channel>;
  private currentChannelId: string;
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
    private toast: ToastService,
    private activeRoute: ActivatedRoute,
    private firebaseDynamicLinks: FirebaseDynamicLinks,
    private localStorage: LocalStorageService,
    private network: NetworkService,
    private zone: NgZone,
  ) {
    this.currentLang = this.localStorage.get(APP_CONST.storeKeys.lang);
    if (this.currentLang) {
      this.localStorage.set(APP_CONST.storeKeys.lang, this.currentLang);
    } else {
      this.localStorage.set(APP_CONST.storeKeys.lang, APP_CONST.lang.es);
    }
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang(this.currentLang);
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use(this.currentLang);
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#DB3A34');
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initCloudMessage();
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
    moment.locale('ar', {
      calendar: {
        sameDay: '[ARHoy]',
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
    this.onLangChange();
    this.checkInternet();
  }

  goToPage(url: string) {
    this.menu.close();
    if (url === 'logout') {
      this.store.dispatch(new LogoutAction());
    } else {
      this.router.navigateByUrl(url);
    }
  }

  changeLanguage() {
    if (this.currentLang === APP_CONST.lang.es) {
      this.isLangSpanish = true;
      this.localStorage.set(APP_CONST.storeKeys.lang, APP_CONST.lang.ar);
      this.translate.use(APP_CONST.lang.ar);
    } else {
      this.isLangSpanish = false;
      this.localStorage.set(APP_CONST.storeKeys.lang, APP_CONST.lang.es);
      this.translate.use(APP_CONST.lang.es);
    }
  }

  private checkInternet() {
    this.network.getNetworkStatus().subscribe(isConnected => {
      if (isConnected) {
        this.store.dispatch(new NetworkConnectedAction());
      } else {
        this.store.dispatch(new NetworkDisconnectAction());
      }
    });
  }

  private onLangChange() {
    this.translate.onLangChange.subscribe(({lang}) => {
      this.currentLang = lang;
      if (this.currentLang === APP_CONST.lang.ar) {
        this.isLangSpanish = false;
        this.directionLang = 'rtl';
      } else {
        this.isLangSpanish = true;
        this.directionLang = 'ltr';
      }
      moment.locale(this.currentLang);
    });
  }

  private initCloudMessage() {
    if (this.platform.is('cordova')) {
      this.fMessaging.getToken().then((data) => console.log('Token ', data));
      this.fMessaging.onMessage().subscribe((message) => {
        console.log('onMessage ', message);
        const confToast: MyToastOption = {
          message: message.body,
          color: 'success',
          closeButtonText: this.translate.instant('general.close'),
          showCloseButton: true,
        };
        if (message.channelId !== this.currentChannelId) {
          this.toast.show(confToast);
        }
      });

      this.fMessaging.onBackgroundMessage().subscribe((message) => {
        console.log('onBackgroundMessage ', message);
        this.zone.run(() => {
          this.router.navigate([ROUTE.chat, message.channelId],
            {queryParams: {fromProduct: 'false', id: message.channelId}});
        });
      });

      this.activeRoute.queryParams
        .subscribe(params => {
          this.currentChannelId = params && params.id || null;
        });
      // Handle the logic here after opening the app with the Dynamic link
      this.firebaseDynamicLinks.onDynamicLink()
        .subscribe((res: any) => {
          console.log(res);
          const url = new URL(res.deepLink);
          let page = url.searchParams.get('page');
          const actionCode = url.searchParams.get('oobCode');
          const mode = url.searchParams.get('mode');
          if (mode === 'resetPassword') {page = '/reset-password';}

          console.log({actionCode, page, mode});
          this.zone.run(() => {
            this.router.navigate([page], {queryParams: {actionCode, mode}});
          });
        }, (error: any) => console.log(error));

    }
  }

}
