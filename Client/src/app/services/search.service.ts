import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor() { }
  private searchSubject = new BehaviorSubject<string>('');
  search$ = this.searchSubject.asObservable()
  setSearchValue(value: string) {
    this.searchSubject.next(value);
  }
  clearSearchValue(){
    this.searchSubject.next('');
  }
}
