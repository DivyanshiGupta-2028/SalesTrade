// import { Component, OnInit } from '@angular/core';
// import { catchError, Observable, of, switchMap } from 'rxjs';
// import { LicenseService } from 'src/app/services/Licenses/licenseservice.service';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { UserProfile } from '../../Models/Client.model';

// @Component({
//   selector: 'app-profile',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './profile.html',
//   styleUrl: './profile.scss'
// })
// export class Profile implements OnInit{
//   //user$: Observable<UserProfile | undefined>;
//   errors$: Observable<string[]> | undefined;
//   userId: string = '';
//   email: string | null = '';
//   constructor(
//     private licenseService: LicenseService,
//     private route: ActivatedRoute,
//     private router: Router
//   ) {
//     const state = this.router.getCurrentNavigation()?.extras.state;
//     if (state && state['email']) {
//       this.email = state['email'];
//     }
//     // this.email = this.route.snapshot.paramMap.get('email');
//     // this.user$ = this.route.queryParams.pipe(
//     //   switchMap(params => {
//     //     const userId = params['userId'] as string;
//     //     return this.licenseService.getUserDetail(userId).pipe(
//     //       catchError(error => {
//     //         console.error('Error fetching user details:', error);
//     //         this.errors$ = of(['Error fetching user details']);
//     //         return of(undefined);
//     //       })
//     //     );
//     //   })
//     // );
//   }

//   ngOnInit() {

//     if (!this.email && window.history.state?.email) {
//       this.email = window.history.state.email;
//       return this.licenseService.getUserDetailByMail(email).pipe(
//           catchError(error => {
//             console.error('Error fetching user details:', error);
//             this.errors$ = of(['Error fetching user details']);
//             return of(undefined);
//           })
//         );
//     }
//   }
// }




















import { Component, OnInit } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
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
export class Profile implements OnInit {
  user$: Observable<UserProfile | undefined> | undefined;
  errors$: Observable<string[]> | undefined;
  userId: string = '';
  email: string | null = '';

  constructor(
    private licenseService: LicenseService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Get email from navigation state
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state && state['email']) {
      this.email = state['email'];
    }
  }

  ngOnInit(): void {
    // Check if email is still missing from history.state
    if (!this.email && window.history.state?.email) {
      this.email = window.history.state.email;
    }

    // If we have email, fetch user details
    if (this.email) {
      this.user$ = this.licenseService.getUserDetailByMail(this.email).pipe(
        catchError(error => {
          console.error('Error fetching user details:', error);
          this.errors$ = of(['Error fetching user details']);
          return of(undefined);
        })
      );
    } else {
      this.errors$ = of(['No email provided']);
    }
  }
}