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
    private statusBar: StatusBar
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

  private initMomentArab() {
    moment.locale('fr', {
      months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
      monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
      monthsParseExact: true,
      weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
      weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
      weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
      weekdaysParseExact: true,
      longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY HH:mm',
        LLLL: 'dddd D MMMM YYYY HH:mm'
      },
      calendar: {
        sameDay: '[Aujourd’hui à] LT',
        nextDay: '[Demain à] LT',
        nextWeek: 'dddd [à] LT',
        lastDay: '[Hier à] LT',
        lastWeek: 'dddd [dernier à] LT',
        sameElse: 'L'
      },
      relativeTime: {
        future: 'dans %s',
        past: 'il y a %s',
        s: 'quelques secondes',
        m: 'une minute',
        mm: '%d minutes',
        h: 'une heure',
        hh: '%d heures',
        d: 'un jour',
        dd: '%d jours',
        M: 'un mois',
        MM: '%d mois',
        y: 'un an',
        yy: '%d ans'
      },
      dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
      ordinal: function (number) {
        return number + (number === 1 ? 'er' : 'e');
      },
      meridiemParse: /PD|MD/,
      isPM: function (input) {
        return input.charAt(0) === 'M';
      },
      // In case the meridiem units are not separated around 12, then implement
      // this function (look at locale/id.js for an example).
      // meridiemHour : function (hour, meridiem) {
      //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
      // },
      meridiem: function (hours, minutes, isLower) {
        return hours < 12 ? 'PD' : 'MD';
      },
      week: {
        dow: 1, // Monday is the first day of the week.
        doy: 4  // Used to determine first week of the year.
      }
    });
  }
}
