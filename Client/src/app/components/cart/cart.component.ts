import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Iproduct } from '../../models/iproduct';
import { Subscription } from 'rxjs';
import { Icart } from '../../models/icart';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit, OnDestroy {
  cartProducts: any[] = [];
  cartTotalPrice: number = 0;
  cartSubscriptions!: Subscription;
  isUserLoggedIn!: boolean;
  constructor(private _cartService: CartService) {}
  ngOnInit(): void {
    this.cartSubscriptions = this._cartService
      .cartService$
      .subscribe((data: any) => {
        if (!data) {
          this.cartProducts = [];
          this.cartTotalPrice = 0;
        } else {
          console.log("CART UPDATED" , data);
          this.cartProducts = Array.from(data.products);
          this.cartTotalPrice = +data.totalPrice
        }
      });
      this._cartService.getCartProducts();
  }
  closeCart() {
    document.body.classList.remove('cart-visible');
  }
  ngOnDestroy(): void {
    this.closeCart();
    this.cartSubscriptions.unsubscribe();
  }
  removeFromCart(prodId: string) {
    return this._cartService.removeFromCart(prodId).subscribe((data: any) => {
      this.cartProducts = data.products
    });
  }
  increaseQty(product: Iproduct) {
    return this._cartService.addToCart(product).subscribe((data) => {
      this.cartProducts = data.products;
    });
  }
  decreaseQty(prodId: string) {
    return this._cartService.decreaseQty(prodId).subscribe((data) => {
      this.cartProducts = data.products;
    });
  }
  checkout() {
    this._cartService.checkout().subscribe((data) => {
      this.cartProducts = data.products;
    });
  }
}
