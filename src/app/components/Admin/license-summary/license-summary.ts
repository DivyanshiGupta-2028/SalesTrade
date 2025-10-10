import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, switchMap, catchError, of } from 'rxjs';
import { Exchangenavbar } from '../../Manage-Exchanges/exchangenavbar/exchangenavbar';
import { License, LicenseActive } from '../../Models/license.models';
import { LicenseService } from '../../../services/Licenses/licenseservice.service';
// import { RenewLicense } from '../renew-license/renew-license';
import { UserBarControl } from '../../user-bar-control/user-bar-control';
import { AdminLicenseService } from 'src/app/services/Admin/admin-license-service.service';


@Component({
  selector: 'app-license-summary',
  standalone: true,
  imports: [CommonModule, UserBarControl],
  templateUrl: './license-summary.html',
  styleUrl: './license-summary.scss'
})
export class UserLicenseSummary {
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
    private adminlicenseService: AdminLicenseService,
    private route: ActivatedRoute,
    private router:Router
  ) {
    this.license$ = this.route.queryParams.pipe(  
  switchMap(params => {
    const licenseId = +params['licenseId'];
    return this.adminlicenseService.getUserLicenseDetail(licenseId).pipe(
      catchError(error => {
        console.error('Error fetching license details:', error);
        this.errors$ = of(['Error fetching license details']);
        return of(undefined);
      })
    );
  })
);
const user = sessionStorage.getItem('userinfo');
const parsedUser = user ? JSON.parse(user) : null;
  if (parsedUser &&  parsedUser?.id) {
   this.adminlicenseService.getUserDetail(parsedUser?.id).subscribe(userProfile => {
  this.pageSubtitle = `${userProfile.firstName} ${userProfile.lastName}`;
 });
}
  }

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

  }
