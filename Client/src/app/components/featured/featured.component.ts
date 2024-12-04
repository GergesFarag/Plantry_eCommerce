import { Component, OnDestroy, OnInit } from '@angular/core';
import { Iproduct } from '../../models/iproduct';
import { ProductService } from '../../services/product.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-featured',
  templateUrl: './featured.component.html',
  styleUrl: './featured.component.css',
})
export class FeaturedComponent implements OnInit, OnDestroy {
  featuredProducts!: any;
  productServiceSubscription!: Subscription;
  constructor(private _productService: ProductService) {
  }
  ngOnInit(): void {
    this.productServiceSubscription = this._productService
      .getFeaturedProducts()
      .subscribe((products) => {
        this.featuredProducts = products
        console.log('Featured : ', products);
      });
  }
  ngOnDestroy(): void {
    this.productServiceSubscription.unsubscribe();
  }
}
