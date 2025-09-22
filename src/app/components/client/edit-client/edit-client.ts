import { CommonModule } from '@angular/common';
import {  Inject, Optional, OnInit, Component } from '@angular/core';
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
  selector: 'app-edit-client',
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
  templateUrl:'./edit-client.html',
  styleUrl: './edit-client.scss'
})
export class EditClient implements OnInit {
  clientForm!: FormGroup;
  countries: Country[] = [];
  states: State[] = [];
  isLoading = false;
  isSubmitting = false;
  loadingCountries = false;
  loadingStates = false;
  clientId: number;
  originalClient: Client | null = null;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private snackBar: MatSnackBar,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional() @Inject(MatDialogRef) private dialogRef: MatDialogRef<EditClient>
  ) {
    console.log('EditClient constructor - Raw data:', this.data);

    // The client data is passed as extraData from the popup service
    const clientData = this.data?.extraData;
    console.log('EditClient constructor - Client data:', clientData);

    // Get the client ID from the extraData - try multiple possible property names
    this.clientId = clientData?.id || clientData?.clientId || clientData?.Id;

    console.log('EditClient constructor - Client ID:', this.clientId);

    // If we still don't have clientId, log the structure to debug
    if (!this.clientId) {
      console.error('No client ID found. Full data structure:', this.data);
      console.error('Client data structure:', clientData);

      // Try to get ID from nested structures
      if (clientData && typeof clientData === 'object') {
        console.log('Available properties in clientData:', Object.keys(clientData));
      }
    }

    this.initializeForm();
  }

  ngOnInit(): void {
    if (this.clientId) {
      this.loadClientData();
    } else {
      this.showError('Client ID is required for editing');
    }
  }

  private initializeForm(): void {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\+?[\d\s\-\(\)]{10,}$/)]],
      company_Name: [''],
      project_Name: [''],
      country: ['', Validators.required],
      state: [''],
      address: [''],
      gst_No: ['', Validators.required]
    });

    // Watch for country changes to load states
    this.clientForm.get('country')?.valueChanges.subscribe(countryId => {
      if (countryId) {
        this.loadStates(countryId);
        this.clientForm.get('state')?.setValue('');
      } else {
        this.states = [];
      }
    });
  }

  private loadClientData(): void {
    this.isLoading = true;

    // Load countries first, then client data
    this.loadCountries().then(() => {
      this.clientService.getClientById(this.clientId).subscribe({
        next: (client: Client) => {
          console.log('Loaded client data:', client);
          this.originalClient = client;
          this.populateForm(client);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading client:', error);
          this.showError('Failed to load client data. Please try again.');
          this.isLoading = false;
        }
      });
    }).catch(error => {
      console.error('Error loading countries:', error);
      this.showError('Failed to load countries. Please try again.');
      this.isLoading = false;
    });
  }

  private loadCountries(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loadingCountries = true;
      this.clientService.getCountries().subscribe({
        next: (countries) => {
          this.countries = countries;
          this.loadingCountries = false;
          resolve();
        },
        error: (error) => {
          this.loadingCountries = false;
          reject(error);
        }
      });
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
    console.log('Populating form with client:', client);
    console.log('Available countries:', this.countries);

    // Find country ID from name (case-insensitive comparison)
    const countryId = this.countries.find(c =>
      c.name.toLowerCase() === (client.country || '').toLowerCase()
    )?.id;

    console.log('Found country ID:', countryId, 'for country:', client.country);

    // Populate form with client data
    this.clientForm.patchValue({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      company_Name: client.company_Name || '',
      project_Name: client.project_Name || '',
      country: countryId || '',
      address: client.address || '',
      gst_No: client.gst_No || ''
    });

    // Load states for the selected country, then set state
    if (countryId && client.country) {
      this.loadingStates = true;
      this.clientService.getStatesByCountryName(client.country).subscribe({
        next: (states) => {
          console.log('Loaded states for country:', client.country, states);
          this.states = states;
          this.loadingStates = false;

          // Set the state ID if state exists
          if (client.state) {
            const stateId = states.find(s => s.name === client.state)?.id;
            console.log('Found state ID:', stateId, 'for state:', client.state);
            if (stateId) {
              this.clientForm.get('state')?.setValue(stateId);
            }
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
    if (this.clientForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const formValue = this.clientForm.value;
      console.log('Form values:', formValue);

      // Get country and state names from their respective arrays
      const selectedCountry = this.countries.find(country => country.id === formValue.country);
      const selectedState = this.states.find(state => state.id === formValue.state);

      console.log('Selected country:', selectedCountry);
      console.log('Selected state:', selectedState);

      const updatedClient: Client = {
        ...this.originalClient,
        id: this.clientId, // Ensure the ID is preserved
        name: formValue.name,
        email: formValue.email,
        phone: formValue.phone,
        company_Name: formValue.company_Name,
        project_Name: formValue.project_Name,
        country: selectedCountry ? selectedCountry.name : '',
        state: selectedState ? selectedState.name : '',
        address: formValue.address,
        gst_No: formValue.gst_No,
        user_id: formValue.user_id
      };

      console.log('Updated client object:', updatedClient);

      this.clientService.updateClient(this.clientId, updatedClient).subscribe({
        next: (response) => {
          console.log('Update response:', response);
          this.showSuccess('Client updated successfully!');
          this.closeDialog(response);
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error updating client:', error);
          this.showError(error.message || 'Failed to update client. Please try again.');
          this.isSubmitting = false;
        }
      });
    } else {
      console.log('Form is invalid or already submitting');
      this.markFormGroupTouched(this.clientForm);
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

  // Helper methods for template
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
      gst_No: 'GST Number'
    };

    return labels[fieldName] || fieldName;
  }
}
