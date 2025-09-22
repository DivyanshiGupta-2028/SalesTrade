
import { CommonModule } from '@angular/common';
import { Component, Inject, Optional, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClientService } from '../../../services/Client/client-service';
import { Client, Country, State } from '../../Models/Client.model';




@Component({
  selector: 'app-add-client',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './add-client.html',
  styleUrls: ['./add-client.scss']
})
export class AddClient implements OnInit {
  clientForm!: FormGroup;
  countries: Country[] = [];
  states: State[] = [];
  isLoading = false;
  isSubmitting = false;
  loadingCountries = false;
  loadingStates = false;
  users: any[] = [];
  loadingUsers = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private snackBar: MatSnackBar,
    @Optional() @Inject(MatDialogRef) private dialogRef: MatDialogRef<AddClient>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadCountries();
    this.getUsers();
    // If editing existing client
    if (this.data?.client) {
      this.populateForm(this.data.client);
    }
  }

  private initializeForm(): void {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\+?[\d\s\-\(\)]{10,}$/)]],
      company_Name: [''],
      project_Name: [''],
      country: [''],
      state: [''],
      address: [''],
      gst_No: [''],
      user_id: ['', Validators.required] // Make sure this is required
    });

    this.clientForm.get('country')?.valueChanges.subscribe(countryId => {
      if (countryId) {
        this.loadStates(countryId);
        this.clientForm.get('state')?.setValue('');
      } else {
        this.states = [];
      }
    });
  }

  private loadCountries(): void {
    this.loadingCountries = true;
    this.clientService.getCountries().subscribe({
      next: (countries) => {
        console.log('Countries loaded:', countries);
        this.countries = countries;
        this.loadingCountries = false;
      },
      error: (error) => {
        console.error('Error loading countries:', error);
        this.showError('Failed to load countries. Please try again.');
        this.loadingCountries = false;
      }
    });
  }

  private getUsers(): void {
    this.loadingUsers = true;
    this.clientService.getAllUsers().subscribe({
      next: (data) => {
        console.log('Users loaded:', data);
        this.users = data;
        this.loadingUsers = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.showError('Failed to load users. Please try again.');
        this.loadingUsers = false;
      }
    });
  }


  private loadStates(countryId: number): void {
    this.loadingStates = true;
    const selectedCountry = this.countries.find(country => country.id === countryId);

    if (!selectedCountry) {
      console.error('Country not found for ID:', countryId);
      this.loadingStates = false;
      return;
    }


    this.clientService.getStatesByCountryName(selectedCountry.name).subscribe({
      next: (states) => {
        this.states = states;
        this.loadingStates = false;
      },
      error: (error) => {
        console.error('Error loading states:', error);
        this.showError('Failed to load states. Please try again.');
        this.loadingStates = false;
      }
    });
  }


  private populateForm(client: Client): void {

    const countryId = this.countries.find(c => c.name === client.country)?.id;

    this.clientForm.patchValue({
      name: client.name,
      email: client.email,
      phone: client.phone,
      company_Name: client.company_Name,
      project_Name: client.project_Name,
      country: countryId || '',
      state: '',
      address: client.address,
      gst_No: client.gst_No,
      user_id: client.user_id
    });


    if (countryId) {
      this.loadingStates = true;
      this.clientService.getStatesByCountryName(client.country).subscribe({
        next: (states) => {
          this.states = states;
          this.loadingStates = false;


          const stateId = states.find(s => s.name === client.state)?.id;
          if (stateId) {
            this.clientForm.get('state')?.setValue(stateId);
          }
        },
        error: (error) => {
          console.error('Error loading states for edit:', error);
          this.loadingStates = false;
        }
      });
    }
  }


  onSubmit(): void {
    console.log('Form valid:', this.clientForm.valid);
    console.log('Form errors:', this.clientForm.errors);
    console.log('All form values:', this.clientForm.value);


    const userIdControl = this.clientForm.get('user_id');
    console.log('User ID control value:', userIdControl?.value);
    console.log('User ID control errors:', userIdControl?.errors);

    if (this.clientForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const formValue = this.clientForm.value;


      const selectedCountry = this.countries.find(country => country.id === formValue.country);
      const selectedState = this.states.find(state => state.id === formValue.state);


      console.log('Form values:', formValue);
      console.log('Selected country:', selectedCountry);
      console.log('Selected state:', selectedState);
      console.log('User ID from form:', formValue.user_id);

      const userId = formValue.user_id;
      console.log('User ID type:', typeof userId);
      console.log('User ID value:', userId);

      const client: Client = {
        name: formValue.name,
        email: formValue.email,
        phone: formValue.phone || '',
        company_Name: formValue.company_Name || '',
        project_Name: formValue.project_Name || '',
        country: selectedCountry ? selectedCountry.name : '',
        state: selectedState ? selectedState.name : '',
        address: formValue.address || '',
        gst_No: formValue.gst_No || '',
        status: 'Active',
        user_id: Number(userId),
        // created_Datetime: new Date().toISOString(),
        // updated_Datetime: new Date().toISOString()
      };

      console.log('Client object to save:', client);
      console.log('Client object user_id:', client.user_id);

      this.clientService.addClient(client).subscribe({
        next: (response) => {
          console.log('Client added successfully:', response);
          this.showSuccess('Client added successfully!');
          this.closeDialog(response);
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error adding client:', error);
          this.showError(error.message || 'Failed to add client. Please try again.');
          this.isSubmitting = false;
        }
      });
    } else {
      console.log('Form is invalid or already submitting');
      this.markFormGroupTouched(this.clientForm);


      Object.keys(this.clientForm.controls).forEach(key => {
        const control = this.clientForm.get(key);
        if (control?.errors) {
          console.log(`Field ${key} errors:`, control.errors);
        }
      });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  closeDialog(result?: any): void {
    if (this.dialogRef) {
      this.dialogRef.close(result);
    }
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }


  hasError(fieldName: string, errorType: string): boolean {
    const field = this.clientForm.get(fieldName);
    return !!(field && field.hasError(errorType) && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.clientForm.get(fieldName);

    if (field?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }

    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }

    if (field?.hasError('minlength')) {
      return `${this.getFieldLabel(fieldName)} must be at least ${field.errors?.['minlength'].requiredLength} characters`;
    }

    if (field?.hasError('pattern')) {
      return `Please enter a valid ${this.getFieldLabel(fieldName).toLowerCase()}`;
    }

    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      company_Name: 'Company Name',
      project_Name: 'Project Name',
      country: 'Country',
      state: 'State',
      address: 'Address',
      gst_No: 'GST Number',
      user_id: 'User'
    };
    return labels[fieldName] || fieldName;
  }
}
