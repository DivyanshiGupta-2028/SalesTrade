import { Component, OnInit } from '@angular/core';

import { ClientService } from '../../../services/Client/client-service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ExchangeClientAddress } from '../../Models/Client.model';

@Component({
  selector: 'app-manage-client-address-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-client-address-list.html',
  styleUrl: './manage-client-address-list.scss'
})
export class ManageClientAddressList implements OnInit {
  addresses: any[] = [];
  addressTypes: any[] = [];
  loading = false;
  exchangeClientId! : number;

  constructor(private http: HttpClient, private clientService: ClientService, private router: Router, private route: ActivatedRoute ) {}
  ngOnInit() {


     this.route.parent?.paramMap.subscribe(params => {
      const paramClientId = params.get('id');
      if (paramClientId) {
        this.exchangeClientId = +paramClientId;
       this.fetchAddresses();
    this.fetchAddressTypes();
      }
    });

    this.route.queryParamMap.subscribe(params => {
      const queryClientId = params.get('exchangeClientId');
      if (queryClientId) {

        const parsedId = +queryClientId;
        if (parsedId > 0) {
          this.exchangeClientId = parsedId;
         this.fetchAddresses();
    this.fetchAddressTypes();
        }
      }
    });

  }



  fetchAddresses(): void {
    this.loading = true;
    this.clientService.getAddress().subscribe({
      next: (data) => {
        this.addresses = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching addresses', err);
        this.loading = false;
      }
    });
  }

  fetchAddressTypes(): void {
    this.clientService.getAddressTypes().subscribe({
      next: (data) => {
        this.addressTypes = data;
      },
      error: (err) => {
        console.error('Error fetching address types', err);
      }
    });
  }

  getAddressTypeName(id: number): string {
    const found = this.addressTypes.find(type => type.clientAddressId === id);
    return found ? found.clientAddressName : 'Unknown';
  }


  addAddress() {
    this.router.navigate(['./manage-client-address'], {
      queryParams: { exchangeClientId: this.exchangeClientId }
    });
  }
  
  editAddress(address: ExchangeClientAddress) {
    this.router.navigate(['./manage-client-address', address.addressID], {
      queryParams: { exchangeClientId: this.exchangeClientId }
    });
  }
  

  trackByClientId(index: number, item: any) {
    return item.addressID;
  }
  deleteAddress(address: ExchangeClientAddress) {
    if (address.addressID && confirm('Delete this address?')) {
      this.clientService.deleteAddress(address.addressID).subscribe({
        next: () => {
          alert('Contact deleted successfully.');
          this.fetchAddresses();
        },
        error: (err) => {
          console.log('Error deleting contact:', err);
          alert('Failed to delete contact.');
        }
      });
    }
    }
}
