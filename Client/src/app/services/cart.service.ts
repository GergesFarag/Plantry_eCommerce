import { Injectable, OnInit } from '@angular/core';
import { Icart } from '../models/icart';
import { Iproduct } from '../models/iproduct';
import { productVM } from '../viewModels/productVM';
import { BehaviorSubject, catchError, map, Observable, of, Subject, switchMap } from 'rxjs';
import { ProductService } from './product.service';
import { HttpClient } from '@angular/common/http';
import { AuthloginService } from './authlogin.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartServiceSubject: BehaviorSubject<Icart> = new BehaviorSubject<Icart>({
    products: [],
    totalPrice: 0,
    totalQty: 0,
  });
  cartService$: Observable<Icart> = this.cartServiceSubject.asObservable();
  private checkoutSubject:Subject<void> = new Subject<void>();
  checkout$: Observable<void> = this.checkoutSubject.asObservable();
  private URI: string = 'http://localhost:3000/cart';
  constructor(
    private http: HttpClient,
    private _authService: AuthloginService
  ) {
    this.getCartProducts().subscribe();
  }

  getCartProducts(){
    return this.http.get<{ msg: string; data: Icart }>(`${this.URI}` , {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).pipe(
      map(response => {
        this.updateCart(response.data);
        return response.data
      }),
      catchError(err => {
        console.log('Error fetching cart products:', err);
        return of({ products: [], totalPrice: 0, totalQty: 0 });
      })
    );
  }

  getCartTotalPrice(): Observable<number> {
    return this.http.get<{ msg: string; data: number }>(`${this.URI}/totalPrice`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).pipe(
      map(response => {
        const current = this.cartServiceSubject.getValue();
        current.totalPrice = response.data;
        this.cartServiceSubject.next(current);
        return response.data
      }),
      catchError(err => {
        console.log('Error fetching cart total price:', err);
        return of(0);
      })
    );
  }

  // getCartTotalQuantity() {
  //   return this.http.get<{ msg: string; data: number }>(`${this.URI}/totalQty`, {
  //     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //   }).pipe(
  //     map(response => response.data),
  //     catchError(err => {
  //       console.log('Error fetching cart total price:', err);
  //       return of(0);
  //     })
  //   );
  // }

  addToCart(product: Iproduct) {
    return this.http.post<{ msg: string; data: Icart }>(`${this.URI}/`, {
      title : product.title,
      quantity: 1,
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).pipe(
      map((response) => {
        this.updateCart(response.data);
        return response.data
      }),
      catchError(err => {
        console.log('Error adding product to cart:', err);
        throw err;
      })
    );
  }

  removeFromCart(productId: string): Observable<any> {
    return this.http.delete<{ msg: string; data: Icart }>(`${this.URI}/${productId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).pipe(
      map((response) => {
        this.updateCart(response.data);
        return response.data
      }),
      catchError(err => {
        console.log('Error removing product from cart:', err);
        throw err;
      })
    );
  }
  decreaseQty(productId: string): Observable<any> {
    return this.http.patch<{ msg: string; data: Icart }>(`${this.URI}/decQty`, {
      productId: productId,
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).pipe(
      map((response) => {
        this.updateCart(response.data);
        return response.data
      }),
      catchError(err => {
        console.log('Error decreasing product quantity:', err);
        throw err;
      })
    );
  }

  checkout(): Observable<any> {
    return this.http.post<{ msg: string; data: any }>(`${this.URI}/checkout`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).pipe(
      map((response) => {
        this.updateCart(response.data);
        this.checkoutSubject.next(response.data);
        return response.data
      }),
      catchError(err => {
        console.log('Error during checkout:', err);
        throw err;
      })
    );
  }
  private updateCart(cart:Icart){
    this.cartServiceSubject.next(cart);
  }
}
