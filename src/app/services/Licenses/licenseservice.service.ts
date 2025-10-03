import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams } from '@angular/common/http';



//import { FilterOptionCodeModel } from '../../models/optioncode.models';
//import { OptionSettingModel, UpdateOptionModel } from '../../models/optionsetting.Models';
import { License,  LicenseActive,  LicenseFlow,  RenewLicenseModal } from '../../components/Models/license.models';
import { environment } from '../../environments/environment';
import { Currencies } from '../../components/Models/currencies.models';
import { Langauges } from '../../components/Models/langauges.models';
import { Country } from '../../components/Models/country.models';
import { OptionSettingModel, UpdateOptionModel } from '../../components/Models/optionsetting.Models';
import { UserProfile } from 'src/app/components/Models/Client.model';


@Injectable({
  providedIn: 'root'
})
export class LicenseService {
  
  private apiUrl = `${environment.apiUrl}`;

  constructor(private baseService: BaseService, private http: HttpClient) { }

  addLicense(license: License): Observable<License> {
    return this.baseService.post<License>(`${this.apiUrl}/License/add-license`, license);
  }

  addLicenseFlow(license: LicenseFlow): Observable<LicenseFlow> {
    return this.baseService.post<LicenseFlow>(`${this.apiUrl}/License/add-license-flow`, license);
  }
    addExchangeDomain(exchange: License): Observable<License> {
    return this.baseService.post<License>(`${this.apiUrl}/License/add-domain`, exchange);
  }

  getParentLicenses(): Observable<License[]> {
    return this.http.get<License[]>(`${this.apiUrl}/License/parent-list`);
  }

  getLicenses(): Observable<License[]> {
    return this.http.get<License[]>(`${this.apiUrl}/License/list`);
  }
  
  getLicensesByUserId(id:string): Observable<License[]> {
    return this.http.get<License[]>(`${this.apiUrl}/License/list/user/${id}`);
  }

    getUsers(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(`${this.apiUrl}/License/user-list`);
  }
getLicensesByStatus(param: string): Observable<License[]> {
  const params = new HttpParams().set('status', param);

  return this.http.get<License[]>(`${this.apiUrl}/License/status`, { params });
}

//   getLicensesByStatus(): Observable<License[]> {
//   const params = { status: status }; // or use HttpParams as shown below
//   // const params = new HttpParams().set('status', status);
  
//   return this.http.get<License[]>(`${this.apiUrl}/License/list`, { params });
// }

  getCurrencySelectedItems(): Observable<Currencies[]> {
    return this.baseService.get<Currencies[]>(`${this.apiUrl}/License/currencies`);
  }

  getLangaugeSelectedItems(): Observable<Langauges[]> {
    return this.baseService.get<Langauges[]>(`${this.apiUrl}/License/languages`);
  }

  getCountrySelectedItems(): Observable<Country[]> {
    return this.baseService.get<Country[]>(`${this.apiUrl}/License/countries`);
  }

  // getExchangeDetail(id: number): Observable<License> {
  //   console.log(`Fetching exchange details for id: ${id}`);
  //   return this.baseService.get<any>(`${this.apiUrl}/License/${id}/detail`).pipe(
  //     catchError((error) => {
  //       console.error('Error fetching exchange detail:', error);
  //       return throwError(() => new Error('Error fetching exchange detail'));
  //     })
  //   );
  // }

    getLicenseDetail(id: number): Observable<License> {
    console.log(`Fetching license details for id: ${id}`);
    return this.baseService.get<any>(`${this.apiUrl}/License/${id}/license-detail`).pipe(
      catchError((error) => {
        console.error('Error fetching license detail:', error);
        return throwError(() => new Error('Error fetching license detail'));
      })
    );
  }



   getLicenseAddressDetail(id: number): Observable<License> {
    console.log(`Fetching license details for id: ${id}`);
    return this.baseService.get<any>(`${this.apiUrl}/License/${id}/license-address-detail`).pipe(
      catchError((error) => {
        console.error('Error fetching license detail:', error);
        return throwError(() => new Error('Error fetching license detail'));
      })
    );
  }

  getLicenseContactDetail(id: number): Observable<License> {
    console.log(`Fetching contact details for id: ${id}`);
    return this.baseService.get<any>(`${this.apiUrl}/AccountsAdmin/get-license-client-contacts-by-id`).pipe(
      catchError((error) => {
        console.error('Error fetching license detail:', error);
        return throwError(() => new Error('Error fetching license detail'));
      })
    );
  }


  getUserDetail(userId: string): Observable<UserProfile> {
    console.log(`Fetching user details for userId: ${userId}`);
    return this.baseService.get<any>(`${this.apiUrl}/License/${userId}/user-detail`).pipe(
      catchError((error) => {
        console.error('Error fetching license detail:', error);
        return throwError(() => new Error('Error fetching license detail'));
      })
    );
  }

   updateLicense(license: License): Observable<boolean> {  
     return this.baseService.put<boolean>(`${this.apiUrl}/License/modify-license`, license);
  }

     updateLicenseFlow(license: LicenseFlow): Observable<boolean> {  
     return this.baseService.put<boolean>(`${this.apiUrl}/License/update-license-flow`, license);
  }
     updateRenewLicense(license: RenewLicenseModal): Observable<boolean> {  
     return this.baseService.put<boolean>(`${this.apiUrl}/License/upgrade/renew-license`, license);
  }

  renewLicense(licenseId: number, newEndDate: string): Observable<any> {
    const url = `${this.apiUrl}/License/${licenseId}/renew-license`;
    // Sending only the updated end date in the request body
    return this.http.put(url, { endDate: newEndDate });
  }
  
  deleteLicense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/License/delete-license/${id}`);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/License/delete-user/${id}`);
  }

  // suspendLicense(license: { ExchangeId: number }): Observable<{ message: string }> {
  //   return this.http.put<{ message: string }>(`${this.apiUrl}/Exchanges/suspend-license`, license);
  // }

suspendLicense(payload: LicenseActive & { Renewal: string }): Observable<{ message: string }> {
  return this.http.put<{ message: string }>(`${this.apiUrl}/License/suspend-license`, payload);
}



  // getExchangeOptionSettings(exchangeId: number): Observable<OptionSettingModel[]> {
  //   return this.http.get<OptionSettingModel[]>(`${this.apiUrl}/Exchanges`, {
  //     queryParams: { exchangeId: exchangeId.toString() }
  //   });
  // }
  saveLicenseOptionSettings(optionSettings: UpdateOptionModel[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/License/save-option-settings`, optionSettings);
  }
  getLicenseOptionSettings(licenseId: number): Observable<OptionSettingModel[]> {
  const params = new HttpParams().set('licenseId', licenseId.toString());

  return this.http.get<OptionSettingModel[]>(`${this.apiUrl}/License/get-license-option-settings`, { params });
}
}
