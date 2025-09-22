
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';

import { FormBuilder, FormGroup,FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../../services/Client/client-service';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { RoleService } from '../../../services/Roles/role-service';
import { ClientAddress, ExchangeClientAddress } from '../../Models/Client.model';

@Component({
  selector: 'app-manage-client-address',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './manage-client-address.html',
  styleUrl: './manage-client-address.scss'
})
export class ManageClientAddress implements OnInit, OnDestroy {
  @Input() addressData: ExchangeClientAddress | null = null;
  @Input() addressId: number = 0;
  @Input() exchangeId: number = 0;
 exchangeClientId: number = 0;
 @Input() clientId: number = 0;  
  @Output() onSave = new EventEmitter<ExchangeClientAddress>();
  @Output() onCancel = new EventEmitter<void>();

  private destroy$ = new Subject<void>();

  fieldDisplayNames: { [key: string]: string } = {
  clientAddressId: 'Address Type',
  addressLine1: 'Address Line 1',
  addressLine2: 'Address Line 2',
  addressLine3: 'Address Line 3',
  country: 'Country',
  state:'State',
  pincode: 'PinCode',
  latitude: 'Latitude',
  longitude: 'Longitude',
 };

  addressForm!: FormGroup;
  isEditMode = false;
  isLoading = false;
  isClientAddressLoading = true;
  clientAddress: ClientAddress[] = [];

  countryOptions: { value: number, label: string }[] = [];
  timezoneOptions: any[] = [];
  isCountriesLoading = true;
  isTimezonesLoading = true;

   stateOptions: { value: string, label: string }[] = [];
   isStatesLoading = true;
   selectedCountries = 0;


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    public roleService: RoleService
  ) {

  }

ngOnInit() {
   this.addressForm = this.createForm();
    this.clientId = Number(this.route.snapshot.queryParamMap.get('clientId'));
  if (this.roleService.hasRole('Admin')) {
    console.log('Admin Role Detected');
  }
  this.loadClientAddress();

    this.loadCountries();

    

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const routeAddressId = params['id'];
      if (routeAddressId) {
        this.addressId = parseInt(routeAddressId, 10);
        this.loadAddressById(this.addressId);
      } else if (this.addressId > 0) {
        this.loadAddressById(this.addressId);
      } else {
        this.setupForm();
      }
    });
    this.route.queryParamMap.subscribe(params => {
      const exClientIdStr = params.get('exchangeClientId');
      if (exClientIdStr) {
        this.exchangeClientId = +exClientIdStr;
        console.log('exchangeClientId from query param:', this.exchangeClientId);
      }
    });
    this.addressForm.get('country')?.valueChanges
  .pipe(takeUntil(this.destroy$))
  .subscribe((selectedCountry) => {
    if (selectedCountry) {
      this.selectedCountries = selectedCountry;
      this.loadStatesByCountry(selectedCountry);
    } else {
      this.stateOptions = [];
    }
  });


  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  private createForm(): FormGroup {
  return this.fb.group({
    addressID: [null],
 exchangeClientId: [Number(this.clientId), Validators.required],

    clientAddressId: [null, Validators.required],
    addressLine1: ['',[Validators.required, Validators.maxLength(100)]],
    addressLine2: ['', [Validators.required,Validators.maxLength(100)]],
    addressLine3: ['', [Validators.required,Validators.maxLength(100)]],
    addressLine4: ['', Validators.maxLength(100)],
    country: ['', Validators.required],
    state: ['', Validators.maxLength(100)],
    pincode: ['', [Validators.required,Validators.maxLength(10)]],
    latitude: ['', Validators.required],
    longitude: ['', Validators.required]
  });
}



  private setupForm(): void {
    if (this.addressData) {
      this.isEditMode = true;

      this.addressForm.patchValue({
        clientAddressId: this.addressData?.clientAddressId || null,
          addressLine1: this.addressData?.addressLine1 || '',
          addressLine2: this.addressData?.addressLine2 || '',
          addressLine3: this.addressData?.addressLine3 || '',
          addressLine4: this.addressData?.addressLine4 || '',
          country: this.addressData?.country || '',
          state: this.addressData?.state || '',
          pincode: this.addressData?.pincode || '',
          latitude: this.addressData?.latitude ||'',
          longitude: this.addressData?.longitude ||'',
        exchangeClientId: this.addressData.exchangeClientId || null,
          addressID: this.addressData.addressID || null,
      });

      if (this.addressData?.country) {
        this.selectedCountries = this.addressData.country;
        this.loadStatesByCountry(this.addressData.country);
      }
    } else {
      this.addressForm.patchValue({
        isPrimaryContact: false,
        isActive: true
      });


    }
  }

  private loadCountries(): void {
    console.log('Loading countries...');
    this.isCountriesLoading = true;

    this.clientService.getCountries()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (countries: any[]) => {
          console.log('Countries received:', countries);
          this.countryOptions = countries.map(country => ({
            value: country.id,
            label: country.name
          }));
          console.log('Country options:', this.countryOptions);
          this.isCountriesLoading = false;
        },
        error: (error) => {
          console.error('Error loading countries:', error);
          this.countryOptions = [];
          this.isCountriesLoading = false;
        }
      });
  }



  private loadStatesByCountry(countryId: number): void {
  if (!countryId) {
    this.stateOptions = [];
    return;
  }

  this.isStatesLoading = true;

  this.clientService.getStatesByCountry(countryId)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (states: any[]) => {
        this.stateOptions = states.map(state => ({
          value: state.id,
          label: state.name
        }));
        this.isStatesLoading = false;
      },
      error: (error) => {
        console.error('Error loading states:', error);
        this.stateOptions = [];
        this.isStatesLoading = false;
      }
    });
}


  

  private loadClientAddress(): void {
    console.log('Loading Address Types...');
    this.isClientAddressLoading = true;
    this.clientService.getAddressTypes().subscribe({
      next: (clientAddress) => {
        console.log('Address Types received:', clientAddress);
        this.clientAddress = clientAddress;
        this.isClientAddressLoading = false;
      },
      error: (error) => {
        console.error('Error loading Address Types:', error);
        this.clientAddress = [];
        this.isClientAddressLoading = false;
      }
    });
  }

  private loadAddressById(addressId: number): void {
    if (!addressId || addressId <= 0) {
      console.error('Invalid address ID:', addressId);
      return;
    }

    this.isLoading = true;

    this.clientService.getExchangeAddressClientById(this.addressId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (address) => {
          console.log('Address loaded:', address);
          this.addressData = address;
          if (this.exchangeClientId && this.exchangeClientId !== 0) {
        this.addressData.exchangeClientId = this.exchangeClientId;
      }
       this.isEditMode = true;
          this.setupForm();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading address:', error);
          this.isLoading = false;
        }
      });
  }

  onSubmit(): void {
  if (this.addressForm.valid) {
    this.isLoading = true;
    const addressData: ExchangeClientAddress = this.addressForm.value;
  addressData.exchangeClientId = Number(this.exchangeClientId);
    this.clientService.saveAddress(addressData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.onSave.emit(response);
          console.log("Navigating to list with exchangeClientId:", this.exchangeClientId
          );

this.router.navigate(['/manage-client-address-list'], {
  queryParams: { exchangeClientId: this.exchangeClientId
   
    }
});
         
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error saving address:', error);
        }
      });
  } else {
    this.markFormGroupTouched();
  }
}
  onReset(): void {
    this.addressForm.reset();

    this.setupForm();
  }

  onCancelClick(): void {
    this.onCancel.emit();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.addressForm.controls).forEach(field => {
      const control = this.addressForm.get(field);
      control?.markAsTouched({ onlySelf: true });

      if (control && control instanceof FormGroup) {
        Object.keys(control.controls).forEach(nestedField => {
          const nestedControl = control.get(nestedField);
          nestedControl?.markAsTouched({ onlySelf: true });
        });
      }

      if (control && control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          arrayControl.markAsTouched({ onlySelf: true });
          if (arrayControl instanceof FormGroup) {
            Object.keys(arrayControl.controls).forEach(nestedField => {
              const nestedControl = arrayControl.get(nestedField);
              nestedControl?.markAsTouched({ onlySelf: true });
            });
          }
        });
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.addressForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const displayName = this.fieldDisplayNames[fieldName] || fieldName;
    const field = this.addressForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        //const fieldDisplayName = fieldName.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim();
        return `${displayName} is required`;
      }
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['maxlength']) {
       //const fieldDisplayName = fieldName.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim();
        return `${displayName} is too long`;
      }
    }
    return '';
  }

   getClientAddressName(clientAddressId: number): string {
    const clientAddress = this.clientAddress.find(c => c.clientAddressId === clientAddressId);
    return clientAddress ? clientAddress.clientAddressName : '';
  }
}
