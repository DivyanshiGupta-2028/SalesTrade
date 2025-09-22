import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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


}
