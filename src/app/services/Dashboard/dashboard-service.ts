import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getAllExpenses(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/AccountsAdmin/get-expenses`);
  }

  getAllDashboardCardEntries(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/License/cards-count`);
  }
    getDashboardGraphCardEntries(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/License/graph-count`);
  }

  getAllRecordPayments(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/AccountsAdmin/get-record-payments`);
  }

  // addOrUpdateBlog(blog: Blog): Observable<number> {
  //   return this.http.post<number>(`${this.apiUrl}/add-blog`, blog);
  // }
}
