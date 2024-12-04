import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Iproduct } from '../../models/iproduct';
import { SearchService } from '../../services/search.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrl: './store.component.css',
})
export class StoreComponent implements OnInit , OnDestroy {
  products!: any[];
  private searchSubscription!: Subscription;
  constructor(
    private _ProdcutService: ProductService,
    private _searchService: SearchService
  ) {}
  ngOnInit(): void {
    this._ProdcutService.getProducts().subscribe(products => {
      this.products = products;
    })
    this.previewSearchedProducts();
  }
  previewSearchedProducts():void{
    this.searchSubscription = this._searchService.search$.subscribe((searchValue) => {
      if(searchValue != ""){
        this._ProdcutService.getProductsByName(searchValue).subscribe(products => {
          this.products = products;
        })
      }else{
        this._ProdcutService.getProducts().subscribe(products => {
          this.products = products;
        })
      }
    });
  }
  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
    this._searchService.clearSearchValue();
  }
}
