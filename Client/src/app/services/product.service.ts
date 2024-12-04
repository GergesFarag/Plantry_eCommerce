import { Injectable } from '@angular/core';
import { Iproduct } from '../models/iproduct';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productUpdate: BehaviorSubject<Iproduct[]> = new BehaviorSubject<
    Iproduct[]
  >([]);
  productUpdate$: Observable<Iproduct[]> = this.productUpdate.asObservable();
  private URI: string = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Fetch all products
  getProducts(): Observable<Iproduct[]> {
    return this.http
      .get<{ msg: string; data: Iproduct[] }>(`${this.URI}/products`)
      .pipe(
        map((response) => {
          this.updateProductList(response.data); 
          return response.data}), 
        catchError((err) => {
          console.error('Error fetching products:', err);
          return of([]); 
        })
      );
  }

  // Fetch product by ID
  getProductById(id: string): Observable<Iproduct | null> {
    return this.http
      .get<{ msg: string; data: Iproduct }>(`${this.URI}/products/${id}`)
      .pipe(
        map((response) => response.data),
        catchError((err) => {
          console.error(`Error fetching product with ID ${id}:`, err);
          return of(null);
        })
      );
  }

  // Add a new product
  addProduct(product: Iproduct): Observable<Iproduct> {
    return this.http
      .post<{ msg: string; data: Iproduct }>(`${this.URI}/products`, {
        ...product,
      })
      .pipe(
        map((response) => {
          const current = this.productUpdate.getValue();
          this.updateProductList([...current  , response.data]);
          return response.data
        }),
        catchError((err) => {
          console.error('Error adding product:', err);
          throw err;
        })
      );
  }
  updateProduct(product: Iproduct): Observable<Iproduct> {
    return this.http
      .put<{ msg: string; data: Iproduct }>(
        `${this.URI}/products/${product._id}`,
        { ...product }
      )
      .pipe(
        map((response) => {
          const current = this.productUpdate.getValue();
          const index = current.findIndex(
            (p) => p.title === product.title
          );
          if (index!== -1) {
            current[index] = response.data;
            this.updateProductList([...current]);
          }
          return response.data
        }),
        catchError((err) => {
          console.error(`Error updating product with ID ${product.title}:`, err);
          throw err;
        })
      );
  }
  deleteProduct(id: string) {
    return this.http
      .delete<{ msg: string; data: any }>(`${this.URI}/products/${id}`)
      .pipe(
        map((response) =>{
          const currentProducts = this.productUpdate.getValue();
          const updatedProducts = currentProducts.filter((p) => p._id !== id);
          this.productUpdate.next(updatedProducts);
          return response;
        }),
        catchError((err) => {
          console.error(`Error deleting product with ID ${id}:`, err);
          throw err;
        })
      );
  }
  getProductsByCategory(category: string): Observable<Iproduct[]> {
    return this.http
      .get<{ msg: string; data: Iproduct[] }>(
        `${this.URI}/products/category/${category}`
      )
      .pipe(
        map((response) => response.data),
        catchError((err) => {
          console.error(
            `Error fetching products in category ${category}:`,
            err
          );
          return of([]);
        })
      );
  }
  // Fetch featured products
  getFeaturedProducts(){
    return this.http
      .get<{ msg: string; data: any[] }>(`${this.URI}/products/featured`)
      .pipe(
        map((response) => {
          return response.data
        }),
        catchError((err) => {
          console.error('Error fetching featured products:', err);
          return of(err);
        })
      );
  }
  // Fetch product IDs
  getProductsIds(): Observable<string[]> {
    return this.http
      .get<{ msg: string; data: string[] }>(`${this.URI}/products/IDs`)
      .pipe(
        map((response) => response.data),
        catchError((err) => {
          console.error('Error fetching product IDs:', err);
          return of([]);
        })
      );
  }

  // Fetch products by name
  getProductsByName(name: string): Observable<any> {
    return this.http
      .get<{ msg: string; data: any[] }>(
        `${this.URI}/products/search/${name}`
      )
      .pipe(
        map((response) => response.data),
        catchError((err) => {
          console.error(`Error fetching products with name ${name}:`, err);
          return err;
        })
      );
  }
  updateProductList(products: Iproduct[]): void {
    this.productUpdate.next(products);
  }
  updateProductOBS(product: Iproduct){
    const currentProducts = this.productUpdate.getValue();
      this.productUpdate.next([...currentProducts , product]);
  }
}
