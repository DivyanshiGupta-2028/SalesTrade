import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subscription, takeUntil } from 'rxjs';
import { License, RenewLicenseModal } from '../../Models/license.models';
import { LicenseService } from '../../../services/Licenses/licenseservice.service';
import { Router } from '@angular/router';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ExpensesService } from 'src/app/services/Expenses/expenses-service';

@Component({
  selector: 'app-add-expenses',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,MatDialogModule,
    MatFormFieldModule,MatInputModule,MatSelectModule,
    MatDatepickerModule,MatNativeDateModule,MatCheckboxModule,
    MatButtonModule,MatIconModule],
  templateUrl: './add-expenses.html',
  styleUrl: './add-expenses.scss'
})
export class AddExpenses implements OnInit {
selectedFile: File | null = null;
categories: any[] = [];

  expenseForm = this.fb.group({
    vendorName: ['', Validators.required],
    purpose: ['', Validators.required],
    amountPaid: [null, [Validators.required, Validators.min(0)]],
    billAmount: [null, [Validators.required, Validators.min(0)]],
    chequeNumber: [null],
    tds: [null],
    paymentMethod: ['', Validators.required],
    category: ['', Validators.required],
    paymentDate: [new Date(), Validators.required],
    isGstBill: [false],
    tdsApplicable: [false]
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddExpenses>,
    public expensesService: ExpensesService
  ) {}

  ngOnInit(): void {
    this.expensesService.getAllCategories().subscribe({
       next: (data) => this.categories = data,
      error: (err) => console.error('Error fetching expenses:', err)
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      const formData = {
        ...this.expenseForm.value,
        billFile: this.selectedFile
      };

      this.expensesService.addExpense(formData).subscribe({
      next: (response) => {
        const newLicenseId = response.licenseId;
        // this.router.navigate(['/license-client-flow'], {
        //   queryParams: { licenseId: newLicenseId, userId: this.userId }
        // });
      },
      error: (err) => console.error('Error adding license:', err)
    });
      this.dialogRef.close(formData);
    }
  }

//   saveLicense(): void {
//   if (this.licenseForm.invalid) {
//     this.licenseForm.markAllAsTouched();
//     return;
//   }

//   const step2 = this.licenseForm.value.step2;

//   const licensePayload  = {
//     ...this.licenseForm.value.step1,
//     ...step2,
//     ...this.licenseForm.value.step3,
//     ...this.licenseForm.value.step4,
//     userId: this.userId,
//     startDate: this.formatDateOnly(step2.startDate), 
//     endDate: this.formatDateOnly(step2.endDate),
//     dateCreated: this.licenseId ? undefined : new Date()
//   };

//   if (this.licenseId) {
//     licensePayload['licenseId'] = this.licenseId;
//     this.licenseService.updateLicense(licensePayload).subscribe({
//       next: (success: boolean) => {
//         if (success) {
//           this.router.navigate(['/license-client-flow'], {
//             queryParams: { licenseId: this.licenseId, userId: this.userId }
//           });
//         }
//       },
//       error: (err) => console.error('Error updating license:', err)
//     });
//   } else {
//     this.licenseService.addLicense(licensePayload).subscribe({
//       next: (response) => {
//         const newLicenseId = response.licenseId;
//         this.router.navigate(['/license-client-flow'], {
//           queryParams: { licenseId: newLicenseId, userId: this.userId }
//         });
//       },
//       error: (err) => console.error('Error adding license:', err)
//     });
//   }
// }


  onCancel(): void {
    this.dialogRef.close();
  }
}