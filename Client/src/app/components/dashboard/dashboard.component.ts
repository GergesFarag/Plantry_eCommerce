import { Component, OnDestroy, OnInit } from '@angular/core';
import { Iproduct } from '../../models/iproduct';
import { ProductService } from '../../services/product.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit , OnDestroy {
  products: Iproduct[] = [];
  productsSubs!: Subscription;
  isAdmin: boolean = true;
  constructor(private _ProductService: ProductService) {}
  ngOnInit(): void {
    this.productsSubs = this._ProductService.productUpdate$.subscribe(
      (products) => {
        this.products = products;
      }
    );
    this._ProductService.getProducts().subscribe();
  }
  ngOnDestroy(): void {
   this.productsSubs.unsubscribe();
  }
}
