import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  constructor(private http: HttpClient) { }

  private createHeaders(contentType: string = 'application/json'): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': contentType
    });    

    return headers;
  }

  private createParams(paramsObj: any): HttpParams {
    let params = new HttpParams();
    for (const key in paramsObj) {
      if (paramsObj.hasOwnProperty(key)) {
        params = params.set(key, paramsObj[key]);
      }
    }
    return params;
  }

  get<T>(url: string, params?: any): Observable<T> {
    const options = {
      headers: this.createHeaders(),
      params: this.createParams(params),
      withCredentials: true
    };
    return this.http.get<T>(url, options);
  }

  post<T>(url: string, body: any, contentType: string = 'application/json'): Observable<T> {
    const headers = this.createHeaders(contentType);
    return this.http.post<T>(url, body, { headers: headers, withCredentials: true });
  }

  put<T>(url: string, body: any, contentType: string = 'application/json'): Observable<T> {
    const headers = this.createHeaders(contentType);
    return this.http.put<T>(url, body, { headers: headers, withCredentials: true });
  }

  delete<T>(url: string, params?: any): Observable<T> {
    const options = {
      headers: this.createHeaders(),
      params: this.createParams(params),
      withCredentials: true
    };
    return this.http.delete<T>(url, options);
  }

  postFormData<T>(url: string, formData: FormData): Observable<T> {
    const headers = this.createHeaders('multipart/form-data');
    return this.http.post<T>(url, formData, { headers, withCredentials: true });
  }

}
