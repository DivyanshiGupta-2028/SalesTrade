import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private loginData: { username?: string; tempToken?: string; rememberMe?: boolean } = {};
  private userPermissions: any = null;

  setLoginData(username: string, tempToken: string, rememberMe: boolean) {
    this.loginData = { username, tempToken, rememberMe };
  }

  getLoginData() {
    return this.loginData;
  }

  clearLoginData() {
    this.loginData = {};
  }

    setUserPermissions(permissions: any) {
      this.userPermissions = permissions;
    }

    getUserPermissions() {
      return this.userPermissions;
    }

    clearUserPermissions() {
      this.userPermissions = null;
    }


    clearAll() {
      this.clearLoginData();
      this.clearUserPermissions();
    }
}

