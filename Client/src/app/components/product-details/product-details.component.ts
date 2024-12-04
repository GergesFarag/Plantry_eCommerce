import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Iproduct } from '../../models/iproduct';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { productVM } from '../../viewModels/productVM';
import { AuthloginService } from '../../services/authlogin.service';
import { Icart } from '../../models/icart';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  isUserLoggedIn!: any;
  authLoginSubscription!: Subscription;
  instanceProduct!: Iproduct | null;
  currentProductIndex?: number;
  productsIds: string[] = [];
  isAdmin!:boolean;

  constructor(
    private _productService: ProductService,
    private activeRouter: ActivatedRoute,
    private router: Router,
    private _authService: AuthloginService, 
    private _cartService: CartService
  ) {}

  ngOnInit(): void {
    this._authService.isAdminUser().subscribe(auth => {
      this.isAdmin = auth;
    })
    this._authService.authLogin$.subscribe(auth => {
      auth == null ? false : true
      this.isUserLoggedIn = auth;
    })
    this._productService.getProductsIds().subscribe(
      (productsIds) => {
        this.productsIds = productsIds;
      },
      (error) => {
        console.error('Error fetching product IDs:', error);
      }
    );
    this.getProduct();
    this._cartService.checkout$.subscribe(() => {
      if (this.instanceProduct){
        this._productService.getProductById(this.instanceProduct._id).subscribe(product => {
          this.instanceProduct = product
        })
      }
    })
  }
  addToCart() {
    if(!this.isUserLoggedIn){
      return;
    }
    this._cartService.addToCart(this.instanceProduct as Iproduct).subscribe(() => {
    });
  }

  getProduct() {
    this.activeRouter.paramMap.subscribe((params) => {
      const productId = params.get('prodId')
      this._productService.getProductById(productId || "").subscribe(
        (product) => {
          this.instanceProduct = product;
        },
        (error) => {
          console.error('Error fetching product details:', error);
        }
      );
    });
  }

  getNextProduct(pId: string) {
    if (!this.isUserLoggedIn) {
      return;
    }

    this.currentProductIndex = this.productsIds.indexOf(pId);
    if (this.currentProductIndex < this.productsIds.length - 1) {
      this.currentProductIndex++;
      this.router.navigate([
        '/productDetails/' + this.productsIds[this.currentProductIndex],
      ]);
    } else {
      console.log('Already at the last product.');
    }
  }

  getPreviousProduct(pId: string) {
    if (!this.isUserLoggedIn) {
      return;
    }

    this.currentProductIndex = this.productsIds.indexOf(pId);
    if (this.currentProductIndex > 0) {
      this.currentProductIndex--;
      this.router.navigate([
        '/productDetails/' + this.productsIds[this.currentProductIndex],
      ]);
    } else {
      console.log('Already at the first product.');
    }
  }

  backToStore() {
    this.router.navigate(['/store']);
  }

  ngOnDestroy(): void {
    if (this.authLoginSubscription) {
      this.authLoginSubscription.unsubscribe();
    }
  }
}
