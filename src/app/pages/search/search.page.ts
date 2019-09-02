import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/store/search/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  constructor(
    private searchService: SearchService,
  ) { }

  ngOnInit() {
    this.searchService.getProducts('cyRDeDhQI4NqOeFItCD3HnOAQTI3').subscribe(arg => console.log(arg));
  }

}
