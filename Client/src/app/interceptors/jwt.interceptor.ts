// import { Injectable } from '@angular/core';
// import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { AuthloginService } from '../services/authlogin.service';

// @Injectable()
// export class JwtInterceptor implements HttpInterceptor {
//   constructor(private _authService: AuthloginService) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const currentUser = this._authService.currentUserValue
//     if (currentUser && currentUser.token) {
//       req = req.clone({
//         setHeaders: {
//           Authorization: `Bearer ${currentUser.token}`,
//         },
//       });
//     }
//     return next.handle(req);
//   }
// }
