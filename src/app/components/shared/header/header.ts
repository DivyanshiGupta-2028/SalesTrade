import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import {
  faBars,
  faChartBar,
  faFileAlt,
  faFileInvoice,
  faMoneyBillWave,
  faReceipt,
  faUser,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import { PopupService } from '../../../services/Popup/popup-service';
import { AuthService } from '../../../services/auth.service';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { CreateEstimate } from '../../estimate/create-estimate/create-estimate';
import { LicenseService } from 'src/app/services/Licenses/licenseservice.service';


@Component({
  selector: 'app-header',
   standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header implements OnInit {
   menuOpen = false;
   userId : string ='';
   firstName: string = '';
   lastName: string = '';
   showAddUserButton = false;
  constructor(
    private popupService: PopupService,
    private router: Router,
    public authService: AuthService,
    private route:ActivatedRoute,
    private licenseService: LicenseService
  ) {}

  faProfile = faUser;
  faCreate = faFileAlt;
  faMenuIcon = faBars;


  ngOnInit(): void {
     this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Check if current url contains license-dashboard
        this.showAddUserButton = event.urlAfterRedirects.includes('license-dashboard');
      }
    });
     this.route.queryParams.subscribe(params => {
    this. userId =  params['userId'];
    console.log('UserId from query params:', this.userId);
    if (this.userId) {
      this.licenseService.getUserDetail(this.userId).subscribe(user => {
        this.firstName = user?.firstName || '';
        this.lastName = user?.lastName || ''; // Adjust property name based on your API response
      });
    }
  
  }

)}


toggleMenu() {
  this.menuOpen = !this.menuOpen;
}

 navigateToAddProfile() {
    this.router.navigate(['/add-profile']);
  }


  // openEstimatePopup() {
  //   this.popupService.showPopup('Create Estimate', CreateEstimate);
  // }

  // goToInvoiceFormatManager() {
  //   this.router.navigate(['/invoice-format-list']);
  // }
showDropdown = false;

toggleDropdown() {
  this.showDropdown = !this.showDropdown;
}

closeDropdown() {
  setTimeout(() => {
    this.showDropdown = false;
  }, 200);
}

logout() {

  this.authService.logout();
  this.router.navigate(['/login']);
}

}
