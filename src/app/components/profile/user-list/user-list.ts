import { Component, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { LicenseService } from '../../../services/Licenses/licenseservice.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserProfile } from '../../Models/Client.model';
import { AddProfile } from '../add-profile/add-profile';
import { UserBarControl } from '../../user-bar-control/user-bar-control';
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule,AddProfile,ReactiveFormsModule, UserBarControl],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserList implements OnInit {
  id: string = '';
  userId:string = '';
  users$!: Observable<UserProfile[]>;
  showActions = false;
  pageTitle = 'User List';
  pageSubtitle = '';
  showBackFlag = false;
  showSubtitle = false;
  showAlert = false;
showAddProfile = false; 
  alertMessage = 'This is a custom alert message!';
  alertTitle = 'Add User ';


users: any[] = [];
pagedUsers: any[] = [];
currentPage = 1;
itemsPerPage = 15;
totalPages = 0;
pages: number[] = [];
viewAll = false;

  constructor(private fb: FormBuilder,private licenseService: LicenseService, private router: Router, private authService: AuthService,private route: ActivatedRoute) { }
  ngOnInit() {
    this.users$ = this.licenseService.getUsers();

     this.users$.subscribe(data => {
    this.users = data; // ✅ no filter
  //  this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
   // this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.calculatePagination();
    this.setPage(1);
  });
  }


  calculatePagination() {
  if (this.viewAll) {
    this.totalPages = 1;
    this.pages = [1];
  } else {
    this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}

  viewDetails(id: string | undefined) {
    if (id !== undefined) {
      this.router.navigate(['/license-list'], { queryParams: { userId: id } }
      );
    } else {
      console.error('License ID is undefined');
    }
  }

  navigateToAddUser() {
    this.router.navigate(['/add-profile']);
  }


  deleteUser(id: string): void {
    this.licenseService.deleteUser(id).subscribe({
      next: () => {
        console.log(`User with ID ${id} deleted successfully.`);
        alert('Succesfully deleted user');
        this.router.navigate(['/user-list']);
        this.users$ = this.licenseService.getUsers(); 
      },
      error: err => console.error('Error deleting user:', err)
    });
  }
  toggleActions() {
    this.showActions = !this.showActions;
  }

  confirmDelete(id: string) {
  const isConfirmed = confirm("Are you sure you want to delete this user?");
  if (isConfirmed) {
    this.deleteUser(id);
  }
}

openAddUserModal() {
  this.showAddProfile = true;
}

closeAddProfile() {
  this.showAddProfile = false;
  this.users$ = this.licenseService.getUsers();
}


setPage(page: number) {
//   this.currentPage = page;
//   const startIndex = (page - 1) * this.itemsPerPage;
//   const endIndex = startIndex + this.itemsPerPage;
//   this.pagedUsers = this.users.slice(startIndex, endIndex);
// }

this.currentPage = page;
  if (this.viewAll) {
    this.pagedUsers = this.users;
  } else {
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedUsers = this.users.slice(startIndex, endIndex);
  }
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
}


