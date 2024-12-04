import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { Iuser } from '../models/iuser';

@Injectable({
  providedIn: 'root',
})
export class AuthloginService {
  authLoginSubject: BehaviorSubject<any>;
  authLogin$: Observable<any>;
  private URI: string = 'http://localhost:3000';
  constructor(private http: HttpClient) {
    this.authLoginSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('token')!)
    );
    this.authLogin$ = this.authLoginSubject.asObservable();
  }

  register(userData: Iuser) {
    return this.http
      .post<{ msg: string; data: any }>(`${this.URI}/users/register`, {
        ...userData,
      })
      .pipe(
        map((response) => {
          localStorage.setItem('token', JSON.stringify(response.data));
          this.authLoginSubject.next(response.data);
          return response.data;
        })
      );
  }
  login(email: string, password: string) {
    return this.http
      .post<{ msg: string; data: any }>(`${this.URI}/users/login`, {
        email: email,
        password: password,
      })
      .pipe(
        map((response) => {
          localStorage.setItem('token', JSON.stringify(response.data));
          this.authLoginSubject.next(response.data);
          return response.data;
        }),
        catchError((error) => {
          console.error('Error logging in:', error);
          return of(error);
        })
      );
  }
  logout() {
    localStorage.removeItem('token');
    this.authLoginSubject.next(null);
  }
  isAdminUser() {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No token found!');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get<{ msg: string; data: boolean }>(`${this.URI}/users/isAdmin`, {
        headers
      })
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          if (error.status === 401) {
            return throwError('Unauthorized access. Please log in again.');
          }
          return of(error);
        })
      );
  }
  currentUserValue() {
    return this.authLogin$;
  }
}
