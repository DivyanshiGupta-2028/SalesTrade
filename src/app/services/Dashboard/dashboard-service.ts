import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = `${environment.apiUrl}`;

 constructor(private http: HttpClient, private authService: AuthService){}

  // private getHeaders(): HttpHeaders {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     console.error('No token found in localStorage');
  //     throw new Error('No token found');
  //   }
  //   return new HttpHeaders({
  //     'Authorization': `Bearer ${token}`
  //   });
  // }

  getAllExpenses(): Observable<any> {
   
    return this.http.get<any>(`${this.apiUrl}/AccountsAdmin/get-expenses`);
  }

   getAllDashboardCardEntries(): Observable<any> {
     return this.http.get<any>(`${this.apiUrl}/License/cards-count`,  );
  }


    getDashboardGraphCardEntries(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/License/graph-count`);
  }

  // getAllDashboardCardEntries(): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/License/cards-count`, { headers: this.getHeaders() }).pipe(
  //     catchError(err => {
  //       if (err.status === 401) {
  //         return this.authService.refreshToken().pipe(
  //           switchMap(() => this.http.get<any>(`${this.apiUrl}/License/cards-count`, { headers: this.getHeaders() })),
  //           catchError(refreshErr => throwError(() => refreshErr))
  //         );
  //       }
  //       console.error('Error fetching cards count:', err);
  //       return throwError(() => err);
  //     })
  //   );
  // }

  // getDashboardGraphCardEntries(): Observable<any> {
  //    return this.http.get<any>(`${this.apiUrl}/License/graph-count`, 
  //   // { headers: this.getHeaders() }).pipe(
  //   //   catchError(err => {
  //   //     if (err.status === 401) {
  //   //       return this.authService.refreshToken().pipe(
  //   //         switchMap(() => this.http.get<any>(`${this.apiUrl}/License/graph-count`, { headers: this.getHeaders() })),
  //   //         catchError(refreshErr => throwError(() => refreshErr))
  //   //       );
  //   //     }
  //   //     console.error('Error fetching graph count:', err);
  //   //     return throwError(() => err);
  //   //   })
  //   );
  // }
  getAllRecordPayments(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/AccountsAdmin/get-record-payments`);
  }

  // addOrUpdateBlog(blog: Blog): Observable<number> {
  //   return this.http.post<number>(`${this.apiUrl}/add-blog`, blog);
  // }
}
