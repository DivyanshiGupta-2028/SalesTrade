import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../services/Client/client-service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LicenseClientContact } from '../../Models/Client.model';

@Component({
  selector: 'app-manage-client-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './manage-client-list.html',
  styleUrl: './manage-client-list.scss'
})
export class ManageClientList implements OnInit {
  contacts: LicenseClientContact[] = [];
  loading = false;

  licenseClientId! : number;
  errorMessage: any;

  constructor(
    private clientService: ClientService,
    private router: Router,
      private route: ActivatedRoute 
  ) {}

  ngOnInit() {
     this.route.parent?.paramMap.subscribe(params => {
      const paramClientId = params.get('id');
      if (paramClientId) {
        this.licenseClientId = +paramClientId;
        this.getContacts();
      }
    });

    
    this.route.queryParamMap.subscribe(params => {
      const queryClientId = params.get('licenseClientId');
      if (queryClientId) {
       
        const parsedId = +queryClientId;
        if (parsedId > 0) {
          this.licenseClientId = parsedId;
          this.getContacts();
        }
      }
    });
  }


getContacts() {
    this.loading = true;
    this.clientService.getContacts().subscribe({
      next: (data) => {
        this.contacts = data;
        this.loading = false;
      },
      error: (err) => {
        console.log('Error fetching contacts:', err);
        this.loading = false;
      }
    });
  }

addContact() {
  this.router.navigate(['./manage-clients'], {
    queryParams: { licenseClientId: this.licenseClientId }
  });
}

editContact(contact: LicenseClientContact) {
  this.router.navigate(['./manage-clients', contact.id], {
    queryParams: { licenseClientId: this.licenseClientId }
  });
}

  deleteContact(contact: LicenseClientContact) {
  if (contact.id && confirm('Delete this contact?')) {
    this.clientService.deleteContact(contact.id).subscribe({
      next: () => {
        alert('Contact deleted successfully.');
        this.getContacts();
      },
      error: (err) => {
        console.log('Error deleting contact:', err);
        alert('Failed to delete contact.');
      }
    });
  }
  }

}
