import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from 'src/app/services/Client/client-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule ],
  templateUrl: './add-profile.html',
  styleUrl: './add-profile.scss'
})
export class AddProfile {
  guestForm!: FormGroup;
  @Input() title = 'Add User';
showModal = false;
isAddUserModalOpen = false;

@Output() closed: EventEmitter<void> = new EventEmitter<void>();

constructor(private fb: FormBuilder, private clientService: ClientService, private router: Router) {
  this.guestForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });
}




 onClose() {
    console.log('Close clicked'); // Debug check
    this.closed.emit();
  }
onGuestSubmit(): void {
  if (this.guestForm.valid) {
    this.clientService.createGuest(this.guestForm.value).subscribe({
      next: (res) => {
        console.log("Guest creation response:", res);
        const newUserId =  res.userId; 
        if (newUserId) {
          this.router.navigate(['/user-list']);
        } else {
          console.error('No UserId found in response');
        }
      },
      error: (err) => {
        console.error("Error:", err);
      }
    });
     this.closed.emit(); 
  } else {
    this.guestForm.markAllAsTouched();
  }
}


}

