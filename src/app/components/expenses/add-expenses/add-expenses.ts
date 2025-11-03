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
import { ExpenseModel } from '../../Models/Expense.model';
import { Category } from '../../Models/Categories.model';
import { ToastrService } from 'ngx-toastr';

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
categories: Category[] = [];
category_id = 0;

  expenseForm = this.fb.group({
    vendorName: ['', Validators.required],
    purpose: ['', Validators.required],
    amountPaid: [null, [Validators.required, Validators.min(0)]],
    billAmount: [null, [Validators.required, Validators.min(0)]],
    chequeNumber: [null],
    tds: [null],
    paymentMethod: ['', Validators.required],
    category: [0, Validators.required],
    paymentDate: [new Date(), Validators.required],
    isGstBill: [false],
    tdsApplicable: [false],
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddExpenses>,
    public expensesService: ExpensesService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.expensesService.getAllCategories().subscribe({
        next: (data) => this.categories = data,
    //   next: (data) => {
    //   this.categories = data.map(categories => ({
    //     title: categories.title,
    //     category_id: parseInt(categories.category_id)  
    //   }));
    // },
      error: (err) => console.error('Error fetching expenses:', err)
    });
  //   this.expensesService.getAllCategories().subscribe({
  //   next: (data) => {
  //     this.categories = data.map(cat => ({
  //       title: cat.title,
  //       category_id: parseInt(cat.category_id)  
  //     }));
  //   }
  // });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // onSubmit(): void {
  //   if (this.expenseForm.valid) {
  //     const payload = {
  //       ...this.expenseForm.value,
  //       billFile: this.selectedFile
  //     };

  //     this.expensesService.addExpense(payload).subscribe({
  //     next: (response) => {
  //       const newExpenseId = response.id;
  //       // this.router.navigate(['/license-client-flow'], {
  //       //   queryParams: { licenseId: newLicenseId, userId: this.userId }
  //       // });
  //     },
  //     error: (err) => console.error('Error adding license:', err)
  //   });
  //     this.dialogRef.close(payload);
  //   }
  // }


  onSubmit(): void {
  if (this.expenseForm.valid) {
    const formValue = this.expenseForm.value;

    const payload: ExpenseModel = {
      vendor_Name: formValue.vendorName ?? null,
      Payment_Purpose: formValue.purpose ?? null,
      amount_Paid: formValue.amountPaid ?? 0,           
      bill_Amount: formValue.billAmount ?? 0,           
      cheque_Number: formValue.chequeNumber ?? 0,       
      tds: formValue.tds ?? 0,                         
      payment_Method: formValue.paymentMethod ?? '',
      category_id: formValue.category ?? 0,
      payment_Date: this.formatDate(formValue.paymentDate), 
      gst_Bill: formValue.isGstBill ?? false,
      tds_Bill: formValue.tdsApplicable ?? false,
      //bill_File: this.selectedFile ?? null 
    };
console.log('expenseData:', payload)
    this.expensesService.addExpense(payload).subscribe({
      next: (response) => {
        console.log('Expense added:', response);
        this.dialogRef.close(payload);
        this.toastr.success('Successfully added expense!', 'Success', {
        timeOut: 3000
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);
      },
      error: (err) => console.error('Error adding expense:', err)
    });
  }
}
// ngOnInit(): void {
//   // this.expensesService.getAllCategories().subscribe({
//   //   next: (data) => {
//   //     this.categories = data.map(cat => ({
//   //       title: cat.title,
//   //       category_id: parseInt(cat.category_id, 10)  // force number
//   //     }));
//   //   }
//   // });
// }
private formatDate(date: Date | null | undefined): string {
  if (!date) {
    return new Date().toISOString().split('T')[0]; 
  }
  return new Date(date).toISOString().split('T')[0]; 
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