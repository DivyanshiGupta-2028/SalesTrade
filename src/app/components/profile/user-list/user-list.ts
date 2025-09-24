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
  constructor(private fb: FormBuilder,private licenseService: LicenseService, private router: Router, private authService: AuthService,private route: ActivatedRoute) { }
  ngOnInit() {
    this.users$ = this.licenseService.getUsers();
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

}


