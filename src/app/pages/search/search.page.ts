import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { Product } from 'src/app/store/product';
import { Filter, GetSearchAction, SearchState } from 'src/app/store/search';
import { APP_CONST } from 'src/app/util/app.constants';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  @Select(SearchState.getSearchedProducts) products$: Observable<Product[]>;
  @Select(SearchState.getLoading) loading$: Observable<boolean>;
  @ViewChild('ionSearch') ionSearch: IonSearchbar;
  firstSearchDone = false;
  categories = _.cloneDeep(APP_CONST.categories);
  private filter: Filter = {
    category: undefined,
    name: undefined
  };
  constructor(
    private store: Store,
  ) {}

  ngOnInit() {
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.ionSearch.setFocus();
    }, 500);
  }

  getCategory(category: string) {
    this.firstSearchDone = true;
    this.filter.category = category;
    this.filter.name = undefined;
    this.store.dispatch(new GetSearchAction(this.filter));
  }

  handleChange(name: string) {
    if (name.length > 3) {
      this.firstSearchDone = true;
      this.filter.name = name;
      this.filter.category = undefined;
      this.store.dispatch(new GetSearchAction(this.filter));
    }
  }

  handleClear() {
    this.store.dispatch(new GetSearchAction({name: undefined, category: undefined}));
  }

}
