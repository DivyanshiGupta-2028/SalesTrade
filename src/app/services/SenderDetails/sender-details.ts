import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SenderDetails {

 private apiUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) { }

  getAllSenders(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/AccountsAdmin/get-senders`);
  }
  getAllClients(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/AccountsAdmin/get-clients`);
  }
}
