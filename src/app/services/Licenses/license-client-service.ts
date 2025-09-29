import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { LicenseClient, LicenseClientView } from '../../components/Models/LicenseClient';


@Injectable({
  providedIn: 'root'
})
export class LicenseClientService {
private apiUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) {}



// addExchangeClient(clientData: ExchangeClient): Observable<{ ExchangeClientId: number }> {
//     return this.http.post<{ ExchangeClientId: number }>(
//       `${this.apiUrl}/exchanges/add-client`,
//       clientData
//     );
//   }

// addExchangeClient(payload: ExchangeClientPayload): Observable<ExchangeClientPayload> {
//   return this.http.post<ExchangeClientPayload>(`${this.apiUrl}/Exchanges/add-client`, payload);
// }

addLicenseClient(payload: LicenseClient): Observable<LicenseClient> {
  return this.http.post<LicenseClient>(`${this.apiUrl}/License/add-client`, payload);
}

checkBusinessNameExists(businessName?: string, legalName?: string): Observable<boolean> {
  let params = new HttpParams();
  if (businessName) {
    params = params.set('businessName', businessName);
  }
  if (legalName) {
    params = params.set('legalName', legalName);
  }

  return this.http.get<boolean>(`${this.apiUrl}/License/check-business-name`, { params });
}




getLicenseClient(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/License/get-client`);
  }

  getReferringClients(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/License/autocomplete?query=${encodeURIComponent(query)}`).pipe(

    );
  }


getBusinessDetail(licenseId: number) {
 return this.http.get<LicenseClientView>(`${this.apiUrl}/License/GetBusinessDetailsById/${licenseId}`);
}

updateLicenseClient(data: any) {
   return this.http.put(`${this.apiUrl}/License/update-client`, data);
}


}
