import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
//import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  private apiUrl = `${environment.apiUrl}`;

  // Inject BaseService
  constructor(private baseService: BaseService, private http: HttpClient) { }

  getCurrencySelectedItems(): Observable<any[]> {
    return this.baseService.get<any[]>(`${this.apiUrl}/License/currencies`);
  }

  getLangaugeSelectedItems(): Observable<any[]> {
    return this.baseService.get<any[]>(`${this.apiUrl}/License/languages`);
  }

  getCountrySelectedItems(): Observable<any[]> {
    return this.baseService.get<any[]>(`${this.apiUrl}/License/countries`);
  }

}
