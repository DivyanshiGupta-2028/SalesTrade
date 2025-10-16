import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { faBars,faChartBar,faFileAlt,faFileInvoice,faMoneyBillWave,faReceipt,faUser,faUsers} from '@fortawesome/free-solid-svg-icons';
import { PopupService } from '../../../services/Popup/popup-service';
import { AuthService } from '../../../services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
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
   email: string = '';
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
   setTimeout(() => {
    this.loadUserFromSession();
  }, 500);
  //   const user = sessionStorage.getItem('userinfo');
  //   const parsedUser = user ? JSON.parse(user) : null;
  // if (parsedUser &&  parsedUser?.id) {
  //   this.email = parsedUser?.email || '';
  // }
     this.route.queryParams.subscribe(params => {
    this. userId =  params['userId'];
    console.log('UserId from query params:', this.userId);
    if (this.userId) {
      this.licenseService.getUserDetail(this.userId).subscribe(user => {
        this.firstName = user?.firstName || '';
        this.lastName = user?.lastName || ''; 
      });
    }
  
  });

  // this.router.events.subscribe(event => {
  //   if (event instanceof NavigationEnd) {
  //     this.loadUserFromSession();
  //   }
  // });


}

private loadUserFromSession(): void {
  const user = sessionStorage.getItem('userinfo');
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      if (parsedUser && parsedUser.id) {
        this.email = parsedUser.email || '';
        console.log('User loaded from session:', this.email); 
      }
    } catch (error) {
      console.error('Error parsing session user:', error);
    }
  }
}


toggleMenu() {
  this.menuOpen = !this.menuOpen;
}


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
