import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { License, LicenseActive } from '../../Models/license.models';
import { Observable } from 'rxjs';
import { LicenseService } from '../../../services/Licenses/licenseservice.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserBarControl } from '../../user-bar-control/user-bar-control';
import { ToastrService } from 'ngx-toastr';
import { RenewLicense } from '../../licenses/renew-license/renew-license';
import { AdminLicenseService } from 'src/app/services/Admin/admin-license-service.service';


@Component({
  selector: 'app-license-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,RenewLicense,ReactiveFormsModule,UserBarControl],
  templateUrl: './license-list.html',
  styleUrl: './license-list.scss'
})

export class AdminLicenseList implements OnInit {
  showAlert = false;
  userId:string = '';
  id: string = '';
  alertMessage = 'This is a custom alert message!';
  alertLicenseId?: number;
  alertTitle = 'Renew License';
  filter = {
    licenseId: undefined,
    licenseParentId: undefined,
    licenseName: ''
  };
  pageTitle = 'My License';
  pageSubtitle = '';
  showBackFlag = true;
  firstName: string = '';
  canAddLicense = true;
  canEditLicense = true;
  canDeleteLicense = true;
  licenses$!: Observable<License[]>;
  showActions = false;
  someParamValue: string | null = null;

  licenses: any[] = []; 

  constructor(private fb: FormBuilder,private adminlicenseService: AdminLicenseService, private router: Router, private authService: AuthService,private route: ActivatedRoute,  private toastr: ToastrService) { }

  ngOnInit() {

const user = sessionStorage.getItem('userinfo');

const parsedUser = user ? JSON.parse(user) : null;
  if (parsedUser &&  parsedUser?.id) {
    this.licenses$ = this.adminlicenseService.getLicensesByUserId(parsedUser?.id);
    this.licenses$.subscribe(data => {
       console.log('Fetched licenses:', data);
  });
  this.adminlicenseService.getUserDetail(parsedUser?.id).subscribe(userProfile => {
   this.pageSubtitle = `${userProfile.firstName} ${userProfile.lastName}`;
 });
} 


  

  }


  getLicenseNameById(licenseId: number): Observable<string> {
    return new Observable<string>((observer) => {
      this.licenses$.subscribe(licenses => {
        const license = licenses.find(e => e.licenseId === licenseId);
        observer.next(license ? license.companyName : 'N/A');
        observer.complete();
      });
    });
  }

viewDetails(licenseId?: number) {
  this.router.navigate(['/license-add'], {
    queryParams: { userId: this.userId, licenseId: licenseId }
  });
}


  
  navigateToAddLicense() {
    this.router.navigate(['/license-add'], {
  queryParams: { userId: this.userId }
});
  }

  toggleActions() {
    this.showActions = !this.showActions;
  }

  confirmSuspend(license: LicenseActive) {
  const isConfirmed = confirm("Are you sure you want to suspend this license?");
  if (isConfirmed) {
  }
}

  confirmDelete(id: number) {
  const isConfirmed = confirm("Are you sure you want to delete this license?");
  if (isConfirmed) {
  }
}


openAlert(licenseId?: number) {
  console.log('openAlert called with licenseId:', licenseId);
  if (licenseId === undefined || licenseId === 0) {
    alert('Invalid Details');
    return;
  }
  this.showAlert = true;   
  this.alertLicenseId = licenseId;  
}


  onAlertClosed() {
    this.showAlert = false;
            window.location.reload();
  }

}

