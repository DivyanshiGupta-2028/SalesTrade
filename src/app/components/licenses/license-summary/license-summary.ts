import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, switchMap, catchError, of } from 'rxjs';
import { Exchangenavbar } from '../../Manage-Exchanges/exchangenavbar/exchangenavbar';
import { License, LicenseActive } from '../../Models/license.models';
import { LicenseService } from '../../../services/Licenses/licenseservice.service';
import { RenewLicense } from '../renew-license/renew-license';
import { UserBarControl } from '../../user-bar-control/user-bar-control';


@Component({
  selector: 'app-license-summary',
  standalone: true,
  imports: [CommonModule, RenewLicense, UserBarControl],
  templateUrl: './license-summary.html',
  styleUrl: './license-summary.scss'
})
export class LicenseSummary {
  license$: Observable<License | undefined>;
  errors$: Observable<string[]> | undefined;
  licenseId: number = 0;
  userId: string = '';
   showAlert = false;
  alertMessage = 'This is a custom alert message!';
  alertLicenseId?: number | undefined;
  alertTitle = 'Renew License';
   pageTitle = 'My License Summary';
  pageSubtitle = '';
  showBackFlag = true;
  firstName: string = '';
  constructor(
    private licenseService: LicenseService,
    private route: ActivatedRoute,
    private router:Router
  ) {
    this.license$ = this.route.queryParams.pipe(  
  switchMap(params => {
    this.userId = params['userId']
    if (this.userId) {
        this.licenseService.getUserDetail(this.userId).subscribe(userProfile => {
  this.pageSubtitle = `${userProfile.firstName} ${userProfile.lastName}`;
});
}
    const licenseId = +params['licenseId'];
    return this.licenseService.getLicenseDetail(licenseId).pipe(
      catchError(error => {
        console.error('Error fetching license details:', error);
        this.errors$ = of(['Error fetching license details']);
        return of(undefined);
      })
    );
  })
);
  }
  // viewDetails(licenseId: number | undefined) {
  //   if (licenseId !== undefined) {
  //     this.router.navigate(['/edit-license', licenseId]);
  //   } else {
  //     console.error('License ID is undefined');
  //   }
  // }

  viewDetails(licenseId?: number) {
  this.router.navigate(['/license-add'], {
    queryParams: { userId: this.userId, licenseId: licenseId }
  });
}

  openAlert(licenseId?: number) {
  console.log('openAlert called with licenseId:', licenseId);
  if (licenseId === undefined || licenseId === 0) {
    alert('Invalid Details');
    return;
  }
  this.showAlert = true;   
  this.licenseId = licenseId;  
}


  onAlertClosed() {
    this.showAlert = false;
    this.license$ = this.licenseService.getLicenseDetail(this.licenseId);
  }
  onSuspend(license: LicenseActive) {
    this.licenseService.suspendLicense({
    licenseId: license.licenseId ?? 0,
    isActive: license.isActive,
    Renewal: false
  }).subscribe({
      next: (res) => {
        console.log(res.message);
        license.isActive = false;
        alert('Succesfully suspended license');
      },
      error: (err) => {
        console.error('Suspend failed', err);
        alert('Failed to suspend license');
      },
    });
  }

  }
