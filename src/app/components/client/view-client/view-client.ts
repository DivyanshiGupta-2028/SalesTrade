import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ClientService } from '../../../services/Client/client-service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AddClient } from '../add-client/add-client';
import { PopupService } from '../../../services/Popup/popup-service';
import { EditClient } from '../edit-client/edit-client';

@Component({
  selector: 'app-view-client',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, RouterModule],
  templateUrl: './view-client.html',
  styleUrl: './view-client.scss'
})
export class ViewClient implements OnInit {
  clients: any[] = [];
  searchText: string = '';
  constructor(private http: HttpClient,private clientService: ClientService, private router: Router, private popupService: PopupService ) {}

  // // Modern Angular 18 inject pattern
  // private http = inject(HttpClient);
  // private popupService = inject(PopupService);
  // private router = inject(Router);

  ngOnInit(): void {
    this.clientService.getAllClients().subscribe({
      next: (data) => this.clients = data,
      error: (err) => console.error('Failed to fetch clients:', err)
    });
  }

  openAddClientPopup(): void {
    this.popupService.showPopup('Add Client', AddClient).subscribe({
      next: (result: any) => {
        if (result) {
          console.log('Client added:', result);
          // Handle the result here - maybe refresh the client list
          this.refreshClientList();
        }
      },
      error: (error) => {
        console.error('Error in popup:', error);
      }
    });
  }




  openEditClientPopup(client: any): void {
  console.log('Opening edit popup for client:', client);

  // First get the full client data by ID
  this.clientService.getClientById(client.id).subscribe({
    next: (fullClientData) => {
      console.log('Full client data received:', fullClientData);

      // Check if fullClientData is valid
      if (!fullClientData) {
        console.error('No client data received from API');
        // You might want to show an error message to the user
        return;
      }


      const dataToPass = {
        ...fullClientData,
        clientId:
        // fullClientData.Id ||
         fullClientData.id || client.id // Fallback to original client.id
      };

      console.log('Data being passed to popup:', dataToPass);

      this.popupService.showPopupWithData('Edit-Client', EditClient, dataToPass).subscribe({
        next: (result: any) => {
          if (result) {
            console.log('Client updated:', result);
            // Refresh the client list after successful edit
            this.refreshClientList();
          }
        },
        error: (error) => {
          console.error('Error in edit popup:', error);
        }
      });
    },
    error: (err) => {
      console.error('Failed to fetch client details:', err);
      // You might want to show an error message to the user
      // this.showError('Failed to load client details');
    }
  });
}
// openEditClientPopup(client: any): void {
//   console.log('Opening edit popup for client:', client);

//   // Quick fix: Pass the original client data directly
//   const dataToPass = {
//     ...client,
//     clientId: client.Id || client.id
//   };

//   this.popupService.showPopupWithData('Edit Client', EditClient, dataToPass).subscribe({
//     next: (result: any) => {
//       if (result) {
//         console.log('Client updated:', result);
//         // Refresh the client list after successful edit
//         this.refreshClientList();
//       }
//     },
//     error: (error) => {
//       console.error('Error in edit popup:', error);
//     }
//   });
// }

  // Alternative method if you want to pass existing client data directly
  openEditClientPopupWithExistingData(client: any): void {
    this.popupService.showPopupWithData('Edit Client', EditClient, client).subscribe({
      next: (result: any) => {
        if (result) {
          console.log('Client updated:', result);
          // Refresh the client list after successful edit
          this.refreshClientList();
        }
      },
      error: (error) => {
        console.error('Error in edit popup:', error);
      }
    });
  }

  // Method to refresh client list after adding new client
  refreshClientList(): void {
    // Add your logic to refresh the client list
    console.log('Refreshing client list...');
    // Example: this.clientService.getAllClients().subscribe(data => this.clients = data);
  }

  goToInvoiceSummary(): void {
    this.router.navigate(['/invoice-summary']);
  }

  get filteredClients(): any[] {
    const search = this.searchText.toLowerCase();
    return this.clients.filter(client =>
      client.name?.toLowerCase().includes(search) ||
      client.email?.toLowerCase().includes(search)
    );
  }
}
