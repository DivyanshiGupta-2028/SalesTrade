import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { estimateModel } from 'src/app/components/estimate/view-estimate/view-estimate';

@Injectable({
  providedIn: 'root'
})
export class EstimateService {

  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getAllEstimates(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/AccountsAdmin/get-estimates`);
  }
getAllBanks(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/AccountsAdmin/get-banks`);
  }

   deleteEstimate(id: number) {
  return this.http.delete(`${this.apiUrl}/AccountsAdmin/delete-estimate/${id}`);
}

markPaid(payload: estimateModel ): Observable<{ message: string }> {
  return this.http.put<{ message: string }>(`${this.apiUrl}/AccountsAdmin/mark-paid`, payload);
}
}
