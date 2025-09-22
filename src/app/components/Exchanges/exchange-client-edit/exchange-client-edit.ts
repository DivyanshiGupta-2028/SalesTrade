import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LicenseClientService } from '../../../services/Licenses/license-client-service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';


@Component({
  selector: 'app-exchange-client-edit',
   standalone: true,
  imports: [CommonModule, ReactiveFormsModule,
  MatFormFieldModule,
MatInputModule,
MatIconModule,
MatTooltipModule,
MatButtonModule,
MatExpansionModule,
MatSlideToggleModule,
MatDatepickerModule,
MatNativeDateModule,
MatStepperModule
  ],
  templateUrl: './exchange-client-edit.html',
  styleUrl: './exchange-client-edit.scss'
})
export class ExchangeClientEdit implements OnInit {
  clientForm!: FormGroup;
  clientId!: number;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private licenseClientService: LicenseClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientId = Number(this.route.snapshot.paramMap.get('id'));
    this.initForm();
    this.loadClient();
  }

  initForm() {
   this.clientForm = this.fb.group({
  businessName: ['', Validators.required],
  legalName: [''],
  businessType: [''],
  clientReference: [''],
  publicGUID: [''],
  exchangeID: [null],
  parentClientID: [null],
  referingClientId: [null],
  taxReferenceGeneral: [''],
  taxReferenceSales: [''],
  kyc: [''],
  cashRevenue: [null],
  website: [''],
  profileDescription: [''],
  currentStatus: [''],
  isLegalDocumentationHeld: [false],
  isTaxReportingExempt: [false],
  total12MonthIncome: [null],
  numberOfEmployee: [null],
  canSendMessages: [false],
  canReceiveMessages: [false],
  isListedInDirectory: [false],
  isListedOnWebsite: [false],
  isActive: [true],
  isLicenseMember: [false],
  hasPermissionToUseInvoiceSystem: [false],
  dateRenewal: [null],
  lastRenewedDate: [null],
  businessStartDate: [null]
});

  }

  loadClient() {
    this.licenseClientService.getBusinessDetail(this.clientId).subscribe({
      next: (data) => {
        this.clientForm.patchValue(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load client details';
        this.loading = false;
        console.error(err);
      }
    });
  }

  save() {
    if (this.clientForm.invalid) return;

    const updatedClient = { ...this.clientForm.value, exchangeClientId: this.clientId };

    this.licenseClientService.updateLicenseClient(updatedClient).subscribe({
      next: () => this.router.navigate(['/exchange-client-list']),
      error: (err) => {
        this.error = 'Failed to update client';
        console.error(err);
      }
    });
  }
}
