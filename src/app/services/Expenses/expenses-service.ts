import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExpenseModel } from 'src/app/components/Models/Expense.model';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

   private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient, private baseService: BaseService) {}

  getAllExpenses(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/AccountsAdmin/get-expenses`);
  }

    deleteExpenses(id: number) {
  return this.http.delete(`${this.apiUrl}/AccountsAdmin/delete-expense/${id}`);
}
  getAllCategories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/AccountsAdmin/get-categories`);
  }

    addExpense(payload: ExpenseModel): Observable<ExpenseModel> {
      return this.baseService.post<ExpenseModel>(`${this.apiUrl}/AccountsAdmin/add-expense`, payload);
    }
 }
