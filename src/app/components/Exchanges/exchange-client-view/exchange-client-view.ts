import { Component, OnInit } from '@angular/core';
import { LicenseClientService } from '../../../services/Licenses/license-client-service';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../services/Client/client-service';

@Component({
  selector: 'app-exchange-client-view',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './exchange-client-view.html',
  styleUrl: './exchange-client-view.scss'
})
export class ExchangeClientView implements OnInit {
  clientId!: number;
  clientData: any;
 licenseClientId!: number;
clientContactData: any;
  constructor(
    private route: ActivatedRoute,
    private licenseClientService: LicenseClientService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
  this.route.parent?.paramMap.subscribe(params => {
    this.clientId = Number(params.get('id'));
this.licenseClientId = Number(params.get('id'));
    this.licenseClientService.getBusinessDetail(this.clientId).subscribe({
      next: (data) => {
        this.clientData = data;
      },
      error: (err) => {
        console.error('Failed to fetch client details:', err);
      }
    });
    this.clientService.getLicenseContactClientByLicenseId(this.licenseClientId).subscribe({
      next: (data) => {
       this.clientContactData = data;
     },
     error: (err) => {
       console.error('Failed to fetch client details:', err);
     }
   });
  });
}
}


