import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlatformService } from '../../services/platform.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-loading-page',
  standalone: true,
  imports: [],
  templateUrl: './loading-page.component.html',
  styleUrl: './loading-page.component.css'
})
export class LoadingPageComponent implements OnInit {
  constructor(private router: Router,
    private platformService: PlatformService, private authService: AuthService) {
  }

  ngOnInit(): void {
    if (this.platformService.isBrowser()) {
      if (this.authService.hasRole('SuperAdmin')) {
        this.router.navigate(['/license-dashboard']);
      }
      else {
        this.router.navigate(['/dashboard']);
      }
    }
  }
}
