
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ClientService } from '../../../services/Client/client-service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Country, Department, LicenseClientContact, PositionsTitle } from '../../Models/Client.model';
import { License } from '../../Models/license.models';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { LicenseService } from '../../../services/Licenses/licenseservice.service';
import { UserBarControl } from '../../user-bar-control/user-bar-control';

@Component({
  selector: 'app-manage-clients',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, UserBarControl],
  templateUrl: './manage-clients.html',
  styleUrl: './manage-clients.scss'
})
export class ManageClients implements OnInit {
  @Input() contactData: LicenseClientContact | null = null;
  @Input() contactId: number = 0;
  licenseClientId: number = 0;
  licenses$!: Observable<License[]>;
  errors$: Observable<string[]> | undefined;
  licenseId: number = 0;
   userId: string = '';
  @Output() onSave = new EventEmitter<LicenseClientContact>();
  @Output() onCancel = new EventEmitter<void>();


  pageTitle = ' Owner Details';
  pageSubtitle = '';
  licenseName = '';
  showBackFlag = true;
  showSubtitle = true;
   showLicenseName = true;

  contactForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  isDepartmentsLoading = true;
  isPositionsoading = true;
  positions: PositionsTitle[] = [];
  departments: Department[] = [];
  clientId! : number;
  defaultDate: string = '';



  titleOptions = [
    { value: 'Mr', label: 'Mr.' },
    { value: 'Mrs', label: 'Mrs.' },
    { value: 'Ms', label: 'Ms.' },
    { value: 'Dr', label: 'Dr.' },
    { value: 'Prof', label: 'Prof.' }
  ];

  genderOptions = [
    { value: 'M', label: 'Male' },
    { value: 'F', label: 'Female' },
    { value: 'G', label: 'Genderfluid' },
    { value: 'T', label: 'Transgender' },
    { value: 'NB', label: 'Non-Binary' },
    { value: 'O', label: 'Other' }

  ];
  fieldDisplayNames: { [key: string]: string } = {
  firstname: 'First Name',
  lastname: 'Last Name',
  emailAddress: 'Email Address',
  title: 'Title',
  positionId: 'Position',
  departmentId:'Department',
  otherPositionTitle: 'Other',
  telephone1: 'Phone Number',
  addressLine1: 'Address Line 1',
  addressLine2: 'Address Line 2',
  addressLine3: 'Address Line 3',
  country: 'Country',
  state:'State',
  pincode: 'PinCode',
 };


  countryOptions: { value: number, label: string }[] = [];
  stateOptions: { value: string, label: string }[] = [];
  isCountriesLoading = true;
  isStatesLoading = false;
  selectedCountry = 0;
  country_id = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private licenseService:LicenseService

  ) {
    this.contactForm = this.createForm();

    const today = new Date();
    const date18YearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
    this.defaultDate = this.formatDate(date18YearsAgo);
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadCountries();
    this.loadPositionsTitle();


    this.setupCountryChangeSubscription();
    this.route.queryParamMap.subscribe(params => {
      const licenseClientIdStr = params.get('licenseClientId');
      const licenseIdStr = params.get('licenseId');
      if(licenseIdStr) {
        this.licenseId = +licenseIdStr;
        this.loadContactById(this.licenseId);
        console.log('licenseId from query param:', this.licenseId)
      }
      if (licenseClientIdStr) {
        this.licenseClientId = +licenseClientIdStr;
        console.log('licenseClientId from query param:', this.licenseClientId);
      }
    });
      this.route.queryParamMap.subscribe(params => {
    this.licenseId = +(params.get('licenseId') || 0);
    this.userId = params.get('userId') || '';

    if (this.userId) {
      this.licenseService.getUserDetail(this.userId).subscribe(userProfile => {
        this.pageSubtitle = `${userProfile.firstName} ${userProfile.lastName}`;
      });
    }

    if (this.licenseId) {
      this.licenseService.getLicenseDetail(this.licenseId).subscribe(license => {
        this.licenseName = license.companyName;
      });
    }
  });


    this.route.params.subscribe(params => {
      const routeContactId = params['id'];
      if (routeContactId) {
        this.contactId = +routeContactId;
        this.loadContactById(this.contactId);
      } else {
        this.setupForm();
      }
    });



}

private formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}


  private setupCountryChangeSubscription(): void {
   this.contactForm.get('country')?.valueChanges.subscribe(value => {
  const country_id = (typeof value === 'string') ? parseInt(value, 10): value ;
  console.log('Country changed to ID:', country_id, typeof country_id);

  if (!isNaN(country_id) && country_id !== this.selectedCountry) {
    this.selectedCountry = country_id;
    this.loadStatesByCountry(country_id);
    this.contactForm.get('state')?.setValue('');
  }
});
  }




  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      firstname: ['', [Validators.required, Validators.maxLength(100)]],
      lastname: ['', Validators.maxLength(100)],
      positionId: ['', Validators.required],
       otherPositionTitle: [''],
      emailAddress: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
      telephone1: ['', [Validators.required,Validators.maxLength(15)]],
      telephone2: ['', Validators.maxLength(15)],
      mobile: ['', Validators.maxLength(15)],
      isPrimaryContact: [false],
      isActive: [true],
      gender: [''],
      dateOfBirth: [''],
      departmentId: ['', Validators.required],
      addressLine1: ['', [Validators.required,Validators.maxLength(100)]],
      addressLine2: ['', [Validators.required,Validators.maxLength(100)]],
      addressLine3: ['', [Validators.required,Validators.maxLength(100)]],
      addressLine4: ['', Validators.maxLength(100)],
      country: ['',Validators.required],
      state: ['', [Validators.required,Validators.maxLength(100)]],
      otherState: [''],
      pincode: ['', [Validators.required,Validators.maxLength(10)]],
      isPrimaryAddress: [true]
    }, { validators: this.phoneUniqueValidator });

    
  }

  private setupForm(): void {
    if (this.contactData) {
      this.isEditMode = true;
      this.contactForm.patchValue({
        title: this.contactData.title || '',
        firstname: this.contactData.firstname,
        lastname: this.contactData.lastname || '',
        positionId:this.contactData.positionId || '',
        otherPositionTitle: this.contactData.otherPositionTitle || '',
        emailAddress: this.contactData.emailAddress,
        telephone1: this.contactData.telephone1 || '',
        telephone2: this.contactData.telephone2 || '',
        mobile: this.contactData.mobile || '',
        isPrimaryContact: this.contactData.isPrimaryContact,
        isActive: this.contactData.isActive,
        gender: this.contactData.gender || '',
        dateOfBirth: this.contactData.dateOfBirth ? new Date(this.contactData.dateOfBirth).toISOString().split('T')[0] : '',
        departmentId: this.contactData.departmentId || '',
        addressLine1: this.contactData.addressLine1 || '',
        addressLine2: this.contactData.addressLine2 || '',
        addressLine3: this.contactData.addressLine3 || '',
        addressLine4: this.contactData.addressLine4 || '',
        country: this.contactData.country || 0,
        state: this.contactData.state || '',
        pincode: this.contactData.pincode || '',
        isPrimaryAddress: this.contactData.isPrimaryAddress,
      });

      if (this.contactData.country) {
        this.selectedCountry = this.contactData.country;
        this.loadStatesByCountry(this.contactData.country);
      }
    } else {
      this.contactForm.patchValue({
        isPrimaryContact: false,
        isActive: true,
        dateOfBirth: this.defaultDate 
      });
    }
    
  }
phoneUniqueValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const tel1 = group.get('telephone1')?.value;
  const tel2 = group.get('telephone2')?.value;
  const mobile = group.get('mobile')?.value;

  const values = [tel1, tel2, mobile].filter(v => !!v);
  const duplicates = values.filter((v, i, arr) => arr.indexOf(v) !== i);

  if (duplicates.length > 0) {
    return { phoneDuplicate: true };
  }

  return null;
};




private loadCountries(): void {
    console.log('Loading countries...');
    this.isCountriesLoading = true;

    this.clientService.getCountries().subscribe({
      next: (countries: Country[]) => {
        console.log('Countries received:', countries);
        countries.forEach(c => {
          if (!c.name || typeof c.name !== 'string' || c.name.trim() === '') {
            console.warn('Invalid country name entry:', c);
          }
        });

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


private loadStatesByCountry(country_id: number): void {
  console.log('Loading states for country:', country_id);
  this.isStatesLoading = true;
  this.stateOptions = [];
  this.clientService.getStatesByCountry(country_id).subscribe({
  next: (states: any[]) => {
    console.log('States received:', states);
    if (states.length > 0) {
      console.log('Sample state object:', states[0]);
    }

    this.stateOptions = states
      .filter(s => s.id && s.name)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(state => ({
         value: state.id,
         label: state.name
      }));

    console.log('State options:', this.stateOptions);
    this.isStatesLoading = false;
  },
  error: (error) => {
    console.error('Error loading states:', error);
    this.stateOptions = [];
    this.isStatesLoading = false;
  }
});
}





  private loadDepartments(): void {
    console.log('Loading departments...');
    this.isDepartmentsLoading = true;
    this.clientService.getDepartments().subscribe({
      next: (departments) => {
        console.log('Departments received:', departments);
        this.departments = departments;
        this.isDepartmentsLoading = false;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.departments = [];
        this.isDepartmentsLoading = false;
      }
    });
  }



  private loadPositionsTitle(): void {
    console.log('Loading positions...');
    this.isPositionsoading = true;
    this.clientService.getPositionsTitle().subscribe({
      next: (positions) => {
        console.log('Positions received:', positions);
        this.positions = positions;
        this.isPositionsoading = false;
      },
      error: (error) => {
        console.error('Error loading positions:', error);
        this.positions = [];
        this.isPositionsoading = false;
      }
    });
  }

  private loadContactById(contactId: number): void {
    this.isLoading = true;
    this.clientService.getLicenseContactClientById(contactId).subscribe({
      next: (contact) => {
        this.contactData = contact;
        if (this.licenseClientId && this.licenseClientId !== 0) {
        this.contactData.licenseClientId = this.licenseClientId;
      }
       this.isEditMode = true;
        this.setupForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading contact:', error);
        this.isLoading = false;
      }
    });
  }

  

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isLoading = true;

       let formData = this.contactForm.value;
      const contactData: LicenseClientContact = {
        ...formData,
        licenseId: this.licenseId,
        userId: this.userId,
        licenseClientId: this.licenseClientId,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null,
        departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
        positionId: formData.positionId ? parseInt(formData.positionId) : null,
      };

      if (this.isEditMode && this.contactData?.id) {
        contactData.id = this.contactData.id;
      }
      console.log('Submitting Contact Data to DB:', contactData);

      this.clientService.saveContact(contactData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.onSave.emit(response);
            console.log("Navigating to list with licenseClientId:", this.licenseClientId, "clientId:", this.clientId, "userId:", this.userId);

this.router.navigate(['/license-list'], 
 {
 queryParams: { userId: this.userId,licenseClientId: this.licenseClientId, clientId: this.clientId, licenseId: this.licenseId }
}
);

          console.log('Result Sent:', response);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error saving contact:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onReset(): void {
    this.contactForm.reset();
    this.setupForm();
  }

  onCancelClick(): void {
    this.onCancel.emit();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach(field => {
      const control = this.contactForm.get(field);
      control?.markAsTouched({ onlySelf: true });

      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(nestedField => {
          const nestedControl = control.get(nestedField);
          nestedControl?.markAsTouched({ onlySelf: true });
        });
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
     const displayName = this.fieldDisplayNames[fieldName] || fieldName;
    const field = this.contactForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${displayName}  is required`;
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['maxlength']) return `${displayName} is too long`;
    }
    return '';
  }

  getDepartmentName(departmentId: number): string {
    const department = this.departments.find(d => d.id === departmentId);
    return department ? department.name : '';
  }

  getPositionName(positionId: number): string {
    const position = this.positions.find(p => p.id === positionId);
    return position ? position.positionName : '';
  }
}
