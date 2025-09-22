// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';
// import { Observable, switchMap } from 'rxjs';
// import { AuthService } from '../../../services/auth.service';
// import { License } from '../../Models/license.models';
// import { LicenseService } from '../../../services/Licenses/licenseservice.service';

// @Component({
//   selector: 'app-exchangelist',
//   templateUrl: './exchangelist.html',
//   styleUrls: ['./exchangelist.scss'],
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule]
// })
// export class ExchangeList implements OnInit {
//   filter = {
//     licenseId: undefined,
//     licenseParentId: undefined,
//     exchangeName: ''
//   };
//   canAddExchange = true;
//   canEditExchange = true;
//   canDeleteExchange = true;
//   exchanges$!: Observable<License[]>;

//   constructor(private exchangeService: LicenseService, private router: Router, private authService: AuthService) { }

//   ngOnInit(): void {
//     this.canAddExchange = this.authService.hasPermission('Exchange_Add');
//     this.canEditExchange = this.authService.hasPermission('Exchange_Edit');
//     this.canDeleteExchange = this.authService.hasPermission('Exchange_Delete');
//     this.authService.getPermissions().subscribe(p => {
//       console.log('Permissions loaded :', p);
//     });
//     this.exchanges$ = this.exchangeService.getExchanges();
//   }
   
//   getExchangeNameById(licenseId: number): Observable<string> {
//     return new Observable<string>((observer) => {
//       this.exchanges$.subscribe(exchanges => {
//         const exchange = exchanges.find(e => e.licenseId === licenseId);
//         observer.next(exchange ? exchange.companyName : 'N/A');
//         observer.complete();
//       });
//     });
//   }


//   viewDetails(licenseId: number | undefined) {
//     if (licenseId !== undefined) {
//       this.router.navigate(['/edit-exchange', licenseId]);
//     } else {
//       console.error('Exchange ID is undefined');
//     }
//   }

//   navigateToAddExchange() {
//     this.router.navigate(['/add-exchange']);
//   }

//   deleteExchange(id: number): void {
//     this.exchangeService.deleteExchange(id).subscribe({
//       next: () => {
//         console.log(`Exchange with ID ${id} deleted successfully.`);
//         this.router.navigate(['/exchangelist']);
//         this.exchanges$ = this.exchangeService.getExchanges(); 
//       },
//       error: err => console.error('Error deleting exchange:', err)
//     });
//   }


// }
