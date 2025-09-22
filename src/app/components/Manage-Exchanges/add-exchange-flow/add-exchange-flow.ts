// import { Component } from '@angular/core';
// import { ExchangeClientFlow } from '../../Exchanges/license-client-flow/license-client-flow';
// import { ManageClients } from '../../client/manage-clients/manage-clients';
// import { HasPermission } from '../../has-permission/has-permission';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-add-exchange-flow',
//   standalone: true,
//   imports: [ExchangeClientFlow, ManageClients, HasPermission, CommonModule],
//   templateUrl: './add-exchange-flow.html',
//   styleUrls: ['./add-exchange-flow.scss']
// })
// export class AddExchangeFlow {
//   currentStep = 0;

//   steps = [
//     'exchangeClientFlow',
//     'manageClients',
//     'hasPermission'
//   ];
//   nextStep() {
//     if (this.currentStep < this.steps.length - 1) {
//       this.currentStep++;
//     }
//   }
//   prevStep() {
//     if (this.currentStep > 0) {
//       this.currentStep--;
//     }
//   }
// }
