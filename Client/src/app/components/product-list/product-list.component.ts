import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  viewChild,
} from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Iproduct } from '../../models/iproduct';
import { CartService } from '../../services/cart.service';
import { AuthloginService } from '../../services/authlogin.service';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  @Input() recievedProducts!: any[];
  @Input() isAdmin?: boolean;
  showAddToCart!:boolean;
  constructor(
    private _productService: ProductService,
    private _cartService: CartService,
    private _authService: AuthloginService
  ) {}
  ngOnInit(): void {
    if (this.isAdmin) {
      this._productService.productUpdate$.subscribe((data) => {
        this.recievedProducts = data;
      });
    }
    this._authService.isAdminUser().subscribe(auth => {
      this.showAddToCart = auth
    })
  }
  addToCart(product: Iproduct) {
    if (!this.showAddToCart) {
      this._cartService.addToCart(product).subscribe({
        next: (data) => {
          console.log('Added to cart', data);
        },
        error: (error) => {
          console.error('Error adding product to cart:', error);
        },
      });
      document.body.classList.add('cart-visible');
    }else{
      alert("You're Admin yala");
    }
  }
  deleteProduct(productId: string) {
    this._productService.deleteProduct(productId).subscribe((done) => {});
  }
}
