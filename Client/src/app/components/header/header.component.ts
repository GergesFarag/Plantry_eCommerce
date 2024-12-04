import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { AuthloginService } from '../../services/authlogin.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  isUserLoggedIn!: any;
  isAdmin!: boolean | string;
  activeSearchBar: boolean = false;
  cartQty!: number;
  constructor(
    private router: Router,
    private searchService: SearchService,
    private _authLoginService: AuthloginService,
    private _cartService: CartService
  ) {}
  ngOnInit(): void {
    this._authLoginService.currentUserValue().subscribe(status => {
      this.isUserLoggedIn = status;
      if(this.isUserLoggedIn){
        this._authLoginService.isAdminUser().subscribe(isAdmin => {
          this.isAdmin = isAdmin;
        })
      }
    })
    this._cartService.cartService$.subscribe(cart => {
      if(this.isUserLoggedIn && !this.isAdmin){
        this.cartQty = +cart?.totalQty || 0
      }else{
        this.cartQty = 0;
      }
    })
  }
  toggleSearchBar() {
    this.activeSearchBar = !this.activeSearchBar;
  }
  onSearch(searchInput: HTMLInputElement) {
    const searchValue = searchInput.value.toLowerCase().trim();
    this.searchService.setSearchValue(searchValue);
    this.router.navigate(['/store']);
    searchInput.value = '';
    this.activeSearchBar = false;
  }
  logout() {
    this._authLoginService.logout();
    this.isUserLoggedIn = false;
    this.isAdmin = false;
    this.router.navigate(['/home']);
  }
  toggleCart() {
    document.body.classList.toggle('cart-visible');
  }
}
