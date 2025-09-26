import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { License, LicenseActive } from '../../Models/license.models';
import { Observable } from 'rxjs';
import { LicenseService } from '../../../services/Licenses/licenseservice.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RenewLicense } from '../renew-license/renew-license';
import { UserBarControl } from '../../user-bar-control/user-bar-control';


@Component({
  selector: 'app-license-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,RenewLicense,ReactiveFormsModule,UserBarControl],
  templateUrl: './license-list.html',
  styleUrl: './license-list.scss'
})

export class LicenseList implements OnInit {
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
  pageTitle = 'My Licenses';
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
filteredLicenses: any[] = [];
pagedLicenses: any[] = [];
currentPage = 1;
itemsPerPage = 15;
totalPages = 0;
pages: number[] = [];
viewAll = false;

  

  constructor(private fb: FormBuilder,private licenseService: LicenseService, private router: Router, private authService: AuthService,private route: ActivatedRoute) { }

  ngOnInit() {
    this.canAddLicense = this.authService.hasPermission('License_Add');
    this.canEditLicense = this.authService.hasPermission('License_Edit');
    this.canDeleteLicense = this.authService.hasPermission('License_Delete');
    this.authService.getPermissions().subscribe(p => {
      console.log('Permissions loaded :', p);
    });
    this.route.queryParams.subscribe(params => {
      this.someParamValue = params['param'];
      this. userId =  params['userId'];
  this.id = params['userId']
  console.log('UserId from query params:', this.id);
        if (this.someParamValue) {
    this.licenses$ = this.licenseService.getLicensesByStatus(this.someParamValue);
    this.licenses$.subscribe(data => {
       console.log('Fetched licenses:', data);
    this.licenses = data; 
    this.filteredLicenses = [...this.licenses];
  //  this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
   // this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.calculatePagination();
    this.setPage(1);
  });
  }
      if (this.userId) {
        this.licenseService.getUserDetail(this.userId).subscribe(userProfile => {
  this.pageSubtitle = `${userProfile.firstName} ${userProfile.lastName}`;
});
}
  
  if (this.id) {
    this.licenses$ = this.licenseService.getLicensesByUserId(this.id);
    this.licenses$.subscribe(data => {
       console.log('Fetched licenses:', data);
    this.licenses = data; 
    this.filteredLicenses = [...this.licenses];// ✅ no filter
  //  this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
   // this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.calculatePagination();
    this.setPage(1);
  });
} else {
    this.licenses$ = this.licenseService.getLicenses();
    
  }
  
  });

  

  }


  onSearch(searchText: string) {
    const lowerText = searchText.toLowerCase();
    this.filteredLicenses = this.licenses.filter(license =>
      (license.companyName?.toLowerCase().includes(lowerText) ?? false) 
      //(license.lastName?.toLowerCase().includes(lowerText) ?? false) ||
      //(license.email?.toLowerCase().includes(lowerText) ?? false)
    );
    this.currentPage = 1; // reset to first page when searching
    this.calculatePagination();
    this.setPage(1);
  }


  calculatePagination() {
    if (this.viewAll) {
      this.totalPages = 1;
      this.pages = [1];
    } else {
      this.totalPages = Math.ceil(this.filteredLicenses.length / this.itemsPerPage);
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
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

  deleteLicense(id: number): void {
    this.licenseService.deleteLicense(id).subscribe({
      next: () => {
        console.log(`License with ID ${id} deleted successfully.`);
        alert('Succesfully deleted license');
        this.licenses$ = this.licenseService.getLicenses(); 
         window.location.reload();
      },
      error: err => console.error('Error deleting license:', err)
    });
  }
  toggleActions() {
    this.showActions = !this.showActions;
  }

  confirmSuspend(license: LicenseActive) {
  const isConfirmed = confirm("Are you sure you want to suspend this license?");
  if (isConfirmed) {
    this.onSuspend(license);
  }
}

  confirmDelete(id: number) {
  const isConfirmed = confirm("Are you sure you want to delete this license?");
  if (isConfirmed) {
    this.deleteLicense(id);
  }
}

onSuspend(license: LicenseActive) {
  this.licenseService.suspendLicense({
  licenseId: license.licenseId ?? 0,
  isActive: license.isActive,
  Renewal: "someStringValue"
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

 setPage(page: number) {
    this.currentPage = page;
    if (this.viewAll) {
      this.pagedLicenses = this.filteredLicenses;
    } else {
      // const startIndex = (page - 1) * this.itemsPerPage;
      // const endIndex = startIndex + this.itemsPerPage;
      // this.pagedLicenses = this.filteredLicenses.slice(startIndex, endIndex);
    const startIndex = (page - 1) * this.itemsPerPage;
    this.pagedLicenses = this.filteredLicenses.slice(startIndex, startIndex + this.itemsPerPage);
  }
  console.log('Paged licenses:', this.pagedLicenses);
  }

goToPage(page: number) {
  if (page < 1 || page > this.totalPages) return;
  this.setPage(page);
}

toggleViewAll() {
  this.viewAll = !this.viewAll;
  this.calculatePagination();
  this.setPage(1);

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
    this.licenses$ = this.licenseService.getLicenses();
  }

}

