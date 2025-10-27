import { Component } from '@angular/core';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { LicenseService } from 'src/app/services/Licenses/licenseservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserProfile } from '../../Models/Client.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {
  user$: Observable<UserProfile | undefined>;
  errors$: Observable<string[]> | undefined;
  userId: string = '';
  email: string | null = '';
  constructor(
    private licenseService: LicenseService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.email = this.route.snapshot.paramMap.get('email');
    this.user$ = this.route.queryParams.pipe(
      switchMap(params => {
        const userId = params['userId'] as string;
        return this.licenseService.getUserDetail(userId).pipe(
          catchError(error => {
            console.error('Error fetching user details:', error);
            this.errors$ = of(['Error fetching user details']);
            return of(undefined);
          })
        );
      })
    );
  }
}

