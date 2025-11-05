import { Injectable } from '@angular/core';
import { Observable, catchError, shareReplay, throwError } from 'rxjs';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { License,  LicenseActive,  LicenseFlow,  RenewLicenseModal } from '../../components/Models/license.models';
import { environment } from '../../environments/environment';
import { Currencies } from '../../components/Models/currencies.models';
import { Langauges } from '../../components/Models/langauges.models';
import { Country } from '../../components/Models/country.models';
import { OptionSettingModel, UpdateOptionModel } from '../../components/Models/optionsetting.Models';
import { UserProfile } from 'src/app/components/Models/Client.model';
import { AuthService } from '../auth.service';
import { RolesModel, UserDetail } from 'src/app/components/Models/Admin.model';


@Injectable({
  providedIn: 'root'
})
export class AdminLicenseService {
  
  private apiUrl = `${environment.apiUrl}`;

  constructor(private baseService: BaseService, private http: HttpClient, private authService: AuthService) { }


  getLicensesByUserId(id:string): Observable<License[]> {
    return this.http.get<License[]>(`${this.apiUrl}/UserAdmin/admin-license/${id}`);
  }

      getUserLicenseDetail(id: number): Observable<License> {
    console.log(`Fetching license details for id: ${id}`);
    return this.baseService.get<any>(`${this.apiUrl}/UserAdmin/${id}/license-detail`).pipe(
      catchError((error) => {
        console.error('Error fetching license detail:', error);
        return throwError(() => new Error('Error fetching license detail'));
      })
    );
  }

  getUserDetail(userId: string): Observable<UserProfile> {
    console.log(`Fetching user details for userId: ${userId}`);
    return this.baseService.get<any>(`${this.apiUrl}/UserAdmin/${userId}/user-detail`).pipe(
      catchError((error) => {
        console.error('Error fetching license detail:', error);
        return throwError(() => new Error('Error fetching license detail'));
      })
    );
  }
    addUserDetail(user: UserDetail): Observable<UserDetail> {
    return this.baseService.post<UserDetail>(`${this.apiUrl}/License/add-license-flow`, user);
  }

  getRoles(): Observable<RolesModel[]> {
    console.log(`Fetching roles`);
    return this.http.get<RolesModel[]>(`${this.apiUrl}/AccountsAdmin/get-roles`).pipe(
      catchError((error) => {
        console.error('Error fetching roles:', error);
        return throwError(() => new Error('Error fetching roles'));
      })
    );
  }



}
