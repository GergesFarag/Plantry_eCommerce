import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthloginService } from '../services/authlogin.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  let authService = inject(AuthloginService);
  let router = inject(Router);
  return authService.isAdminUser().pipe(
    map((isAdmin) => {
      if (isAdmin) {
        console.log('isAdmin:', isAdmin);
        return true;
      } else {
        router.navigate(['/home']);
        return false;
      }
    }),
    catchError((error) => {
      console.error('Error in auth guard:', error);
      router.navigate(['/home']);
      return of(false);
    })
  );
};
