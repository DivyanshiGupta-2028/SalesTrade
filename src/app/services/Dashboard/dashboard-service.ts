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

  getAllExpenses(): Observable<any> {
   
    return this.http.get<any>(`${this.apiUrl}/AccountsAdmin/get-expenses`);
  }


   getFilteredExpenses(month:string, year:number): Observable<any> {
   
    return this.http.get<any>(`${this.apiUrl}/AccountsAdmin/get-filter-expenses`, {
      params: { month, year: year.toString() }
    });
  }

  // getFilteredExpenses(month: string, year: number): Observable<TotalAmountResponse> {
  //   return this.http.get<TotalAmountResponse>(`${this.apiUrl}/get-filter-expenses`, {
  //     params: { month, year: year.toString() }
  //   });
  // }

  // getFilteredRecordPayments(month: string, year: number): Observable<AccountsRecordPayment[]> {
  //   return this.http.get<AccountsRecordPayment[]>(`${this.apiUrl}/get-record-payments-filter`, {
  //     params: { month, year: year.toString() }
  //   });
  // }

   getAllDashboardCardEntries(): Observable<any> {
     return this.http.get<any>(`${this.apiUrl}/License/cards-count`,  );
  }


    getDashboardGraphCardEntries(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/License/graph-count`);
  }


  getAllRecordPayments(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/AccountsAdmin/get-record-payments`);
  }


  getFilteredRecordPayments(month: string, year: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/AccountsAdmin/get-record-payments-filter`, {
      params: { month, year: year.toString() }
    });
  }

}
