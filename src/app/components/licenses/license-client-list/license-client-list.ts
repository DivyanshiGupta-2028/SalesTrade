import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LicenseClientService } from '../../../services/Licenses/license-client-service';

@Component({
  selector: 'app-license-client-list',
   standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule,RouterModule],
  templateUrl: './license-client-list.html',
  styleUrl: './license-client-list.scss'
})
export class LicenseClientList {

   licenseClients: any[] = [];
 constructor(private http: HttpClient,private licenseClientService: LicenseClientService, private router: Router) {}

  ngOnInit(): void {
    this.licenseClientService.getLicenseClient().subscribe({
      next: (data) => this.licenseClients = data,
      error: (err) => console.error('Failed to fetch clients:', err)
    });
  }

goToAddClient() {
  this.router.navigate(['/license-client-flow']);
}

goToViewClient(licenseClientId: number) {
  this.router.navigate(['/license-client-view', licenseClientId]);
  
}

goToEditClient(licenseClientId: number) {
  this.router.navigate(['/license-client-edit', licenseClientId]);
}


}
