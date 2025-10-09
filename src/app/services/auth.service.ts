import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, firstValueFrom, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { BaseService } from './base.service';
import { PlatformService } from './platform.service';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
  private apiUrl = `${environment.apiUrl}/auth`;

  private roleSubject = new BehaviorSubject<Array<string>>([]);
  private permissionsSubject = new BehaviorSubject<any>(null);
  private userInfo = new BehaviorSubject<any>(null);

  private loginCompleted = new BehaviorSubject<boolean>(false);
  private logoutCompleted = new BehaviorSubject<boolean>(false);

  loginCompletedSubs = this.loginCompleted.asObservable();
  logoutCompletedSubs = this.logoutCompleted.asObservable();

  constructor(http: HttpClient, private router: Router,
    private platformService: PlatformService,
    ) {
    super(http);
    this.loadStoredRoleAndPermissions();
  }

  validateLoginRequest(username: string): Observable<any> {
    return this.post<any>(`${this.apiUrl}/validate-login-request`, { username });
  }

  login(username: string,
    password: string,
    temporaryToken: string,
    rememberMe: boolean): Observable<any> {
    return this.post<any>(`${this.apiUrl}/login`, { username, password, temporaryToken }).pipe(
      tap(response => {
        if (response.requiresTwoFactor) {
        } else {
          this.storeTokens(response.token, response.refreshToken, rememberMe);
          this.setRoleAndPermissions(response.roles, response.permissions);
          this.loadUserDetails();
        }
        this.loginCompleted.next(true);
      }),
      catchError(this.handleError)
    );
  }

  loadUserDetails(): void {
    firstValueFrom(this.getUserInfoFromDB()).then(data => {
      if (data != undefined && data != null) {
      }
    });
  }

  refreshToken(): Observable<any> {
    if (this.platformService.isBrowser()) {

      const rememberMe: boolean = sessionStorage.getItem("token") == null ?
        true : false;

      const token = sessionStorage.getItem("token") == null ?
        localStorage.getItem('token') : sessionStorage.getItem("token");

      const refreshToken = sessionStorage.getItem("refreshToken") == null ?
        localStorage.getItem('refreshToken') : sessionStorage.getItem("refreshToken");

      return this.post<any>(`${this.apiUrl}/refresh-token`, { Token: token, RefreshToken: refreshToken }).pipe(
        tap(response => {
          this.storeTokens(response.token, response.refreshToken, rememberMe);
          this.setRoleAndPermissions(response.roles, response.permissions);
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }
    else {
      return throwError(() => new Error('Server Call'));
    }
  }

  getUserInfoFromDB(): Observable<any> {
    if (this.platformService.isBrowser()) {

      const USERINFO = sessionStorage.getItem("userinfo")

      if (USERINFO != undefined
        && USERINFO != null)
      {
        this.userInfo.next(JSON.parse(USERINFO));
          return this.userInfo.asObservable();
      }
      else {
        return this.get<any>(`${this.apiUrl}/user-info`).pipe(
          tap(userinfo => {
            sessionStorage.setItem('userinfo', JSON.stringify(userinfo));
            this.userInfo.next(userinfo);
          })
        );
      }
    }
    else {
      this.userInfo.next(null);
    }

    return this.userInfo.asObservable();
  }

  getAuthToken() {
    if (this.platformService.isBrowser()) {
      if (sessionStorage.getItem("token")) {
        return sessionStorage.getItem('token');
      }
      else {
        return localStorage.getItem('token');
      }
    }
    else {
      return null;
    }
  }


  isLoggedIn(): boolean {
    return !!this.getAuthToken();
  }

  logout(): void {
    if (this.platformService.isBrowser()) {
      this.clearTokens();
      this.logoutCompleted.next(true);
      this.router.navigate(['/validate-login-request']);
    }
  }

  logoutAndStay(): void {
    if (this.platformService.isBrowser()) {
      this.clearTokens();
      this.logoutCompleted.next(true);
    }
  }

  private loadStoredRoleAndPermissions(): void {
    if (this.platformService.isBrowser()) {
      const storedRole = sessionStorage.getItem('roles');
      const storedPermissions = sessionStorage.getItem('permissions');
      if (storedRole != "undefined" && storedPermissions != "undefined"
        && storedRole != "null" && storedPermissions != "null")
      {
        if (storedRole && storedPermissions) {
          this.roleSubject.next(JSON.parse(storedRole));
          this.permissionsSubject.next(JSON.parse(storedPermissions));
        }
      }
    }
  }

  private storeTokens(token: string, refreshToken: string, rememberMe: boolean = false) {
    if (this.platformService.isBrowser()) {

      if (rememberMe) {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
      }
      else {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('refreshToken', refreshToken);
      }
    }
  }

  private setRoleAndPermissions(roles: Array<string>, permissions: any): void {
    this.roleSubject.next(roles);
    this.permissionsSubject.next(permissions);
    sessionStorage.setItem('roles', JSON.stringify(roles));
    sessionStorage.setItem('permissions', JSON.stringify(permissions));
  }

  private clearTokens(): void {
    if (this.platformService.isBrowser())
    {
      if (localStorage.getItem("token")) {
        localStorage.removeItem('token');
      }

      if (localStorage.getItem("refreshToken")) {
        localStorage.removeItem('refreshToken');
      }

      if (sessionStorage.getItem("token")) {
        sessionStorage.removeItem('token');
      }

      if (sessionStorage.getItem("refreshToken")) {
        sessionStorage.removeItem('refreshToken');
      }

      if (sessionStorage.getItem("userinfo")) {
        sessionStorage.removeItem('userinfo');
      }
    }
  }

  getRole(): Observable<Array<string>> {
    return this.roleSubject.asObservable();
  }

  hasRole(role: string): boolean {
    const roles = this.roleSubject.getValue();
    if (!role) return false;
    const roleArray = role.split(',').map(r => r.trim());
    return roleArray.some(r => roles.includes(r));
  }


  hasRoleObservable(role: string) {
  return this.roleSubject.asObservable().pipe(
    map(roles => {
      if (!role) return false;
      const roleArray = role.split(',').map(r => r.trim());
      return roleArray.some(r => roles.includes(r));
    })
  );
}

  getPermissions(): Observable<any> {
    return this.permissionsSubject.asObservable();
  }

  getUserInfo(): Observable<any> {
    return this.userInfo.asObservable();
  }

  private handleError(error: any): Observable<never> {
    return throwError(() => {
      return error;
    });
  }
  hasPermission(permission: string): boolean {
    const permissions = this.permissionsSubject.getValue() || [];
    return permissions.includes(permission);
  }

  hasAnyPermission(permissionList: string[]): boolean {
    const permissions = this.permissionsSubject.getValue() || [];
    return permissionList.some(p => permissions.includes(p));
  }




}

