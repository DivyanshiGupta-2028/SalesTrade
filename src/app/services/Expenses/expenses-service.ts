import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

   private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getAllExpenses(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/AccountsAdmin/get-expenses`);
  }
}
