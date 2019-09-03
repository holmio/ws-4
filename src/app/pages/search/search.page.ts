import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Product } from 'src/app/store/product';
import { GetSearchAction, SearchState } from 'src/app/store/search';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  @Select(SearchState.getSearchedProducts) products$: Observable<Product[]>;
  @Select(SearchState.getLoading) loading$: Observable<boolean>;
  firstSearchDone = false;
  @ViewChild('ionSearch') ionSearch: IonSearchbar;
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

  handleChange(name: string) {
    if (name.length > 3) {
      this.firstSearchDone = true;
      this.store.dispatch(new GetSearchAction({name}));
    }
  }

  handleClear() {
    this.store.dispatch(new GetSearchAction({name: ''}));
  }

}
