import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PlatformService } from '../services/platform.service';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
    private router: Router, private platformService: PlatformService) { }

  canActivate(): boolean {
    if (this.platformService.isBrowser()) {
      if (!this.authService.isLoggedIn()) {        
        this.router.navigate(['/validate-login-request']);
        return false;
      }
    }   
    return true;
  }
}
