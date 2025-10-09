import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, switchMap, throwError, BehaviorSubject } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service'; 

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('token');

  if (req.url.includes('/auth/refresh')) {
    return next(req);
  }

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !req.url.includes('/auth/refresh')) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authService.refreshToken().pipe(
            switchMap((response: any) => {
              isRefreshing = false;

              const newToken = response.accessToken; 
              if (newToken) {
                localStorage.setItem('token', newToken);
                refreshTokenSubject.next(newToken);

                const retryReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`
                  }
                });
                return next(retryReq);
              }
              return throwError(() => new Error('Token refresh failed'));
            }),
            catchError(refreshErr => {
              isRefreshing = false;
              refreshTokenSubject.next(null);

              authService.logout();
              return throwError(() => refreshErr);
            })
          );
        } else {

          return refreshTokenSubject.pipe(
            switchMap(newToken => {
              if (newToken) {
                const retryReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`
                  }
                });
                return next(retryReq);
              }
              return throwError(() => new Error('Token refresh failed'));
            })
          );
        }
      }
      return throwError(() => err);
    })
  );
};