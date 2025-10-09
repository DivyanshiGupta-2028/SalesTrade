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
import { ToastrService } from 'ngx-toastr';
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
  shouldScroll = false;

users: any[] = [];
filteredUsers: any[] = [];
pagedUsers: any[] = [];
currentPage = 1;
itemsPerPage = 15;
totalPages = 0;
pages: number[] = [];
viewAll = false;
searchText = '';

  constructor(private fb: FormBuilder,private licenseService: LicenseService, private router: Router, private authService: AuthService,private route: ActivatedRoute, private toastr:ToastrService) { }
  ngOnInit() {
    this.users$ = this.licenseService.getUsers();

     this.users$.subscribe(data => {
    this.users = data; 
    this.filteredUsers = [...this.users];
    this.calculatePagination();
    this.setPage(1);
  });
  }


  onSearch(searchText: string) {
    const lowerText = searchText.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      (user.firstName?.toLowerCase().includes(lowerText) ?? false) ||
      (user.lastName?.toLowerCase().includes(lowerText) ?? false) ||
      (user.email?.toLowerCase().includes(lowerText) ?? false)
    );
    this.currentPage = 1; 
    this.calculatePagination();
    this.setPage(1);
  }

cancelSearch() {
  this.searchText = '';
  this.onSearch(''); 
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


  navigateToAddLicense(id: string | undefined) {
     if (id !== undefined) {
    this.router.navigate(['/license-add'], {queryParams: { userId: id }
});
  }
}

deleteUser(id: string): void {
    this.licenseService.deleteUser(id).subscribe({
      next: () => {
        console.log(`User with ID ${id} deleted successfully.`);
        this.toastr.success('Successfully deleted user', 'Success', {
          timeOut: 2000
        });

        setTimeout(() => {
          window.location.reload();
        }, 2000); 
      },
      error: (err) => {
        console.error('Error deleting user:', err);
        this.toastr.error('Failed to delete user', 'Error', {
          timeOut: 3000
        });
      }
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



toggleViewAll() {
  this.viewAll = !this.viewAll;
  this.calculatePagination();
  this.setPage(1);

}


selectedPageSize = 15;

onPageSizeChange(event: any) {
  const selectedValue = event.target.value;
   this.selectedPageSize = selectedValue;

  if (selectedValue === 'viewAll') {
    this.viewAll = true;
    this.itemsPerPage = this.filteredUsers.length;
  } else {
    this.viewAll = false;
    this.itemsPerPage = +selectedValue;
  }

  this.calculatePagination();
  this.setPage(1);

  this.updateScrollFlag();
}

updateScrollFlag() {
  if (this.viewAll) {
    this.shouldScroll = this.filteredUsers.length > 5;
  } else {
    this.shouldScroll = this.itemsPerPage > 5;
  }
}


  calculatePagination() {
    if (this.viewAll) {
      this.totalPages = 1;
      this.pages = [1];
    } else {
      this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }
  }

  setPage(page: number) {
    this.currentPage = page;
    if (this.viewAll) {
      this.pagedUsers = this.filteredUsers; 
    } else {
      const startIndex = (page - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.pagedUsers = this.filteredUsers.slice(startIndex, endIndex);
    }
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.setPage(page);
  }

}


