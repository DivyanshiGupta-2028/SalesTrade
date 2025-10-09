import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PlatformService } from '../services/platform.service';


@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService,
    private router: Router, private platformService: PlatformService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.platformService.isBrowser()) {
      if (!this.authService.isLoggedIn()) {
        this.router.navigate(['/validate-login-request']);
        return false;
      }
      const requiredRoles = route.data['role'] as string;
      const roleArray = requiredRoles.split(',').map(role => role.trim()); 
      const hasRequiredRole = roleArray.some(role => this.authService.hasRole(role));
      if (!hasRequiredRole) {
        this.router.navigate(['/denied']);
        return false;
      }
    }
    return true;
  }
}
