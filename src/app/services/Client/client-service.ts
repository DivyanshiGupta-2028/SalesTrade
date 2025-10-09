import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { AccountsCountry, ApiResponse, Client, ClientResponse, Country, ExchangeClientAddress, LicenseClientContact, State, UserProfile } from '../../components/Models/Client.model';
import { NetRoles } from '../../components/Models/NetRoles.models';
import { AuthService } from '../auth.service';



@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient, private authService: AuthService) {}
    addUser(userData: UserProfile): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.apiUrl}/License/add-user`, userData);
  }
createGuest(data: any) {
   return this.http.post<any>(`${this.apiUrl}/Auth/create-guest`, data);
}

  getAllClients(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/AccountsAdmin/get-clients`);
  }

    getContacts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/AccountsAdmin/get-exchange-client-contacts`);
  }


  getAddress(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/AccountsAdmin/get-exchange-client-address`);
  }


  getAddressTypes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/AccountsAdmin/get-ClientAddress-type`);
  }

  addClient(client: Client): Observable<ClientResponse> {
    const clientData = {
      name: client.name,
      email: client.email,
      country: client.country,
      address: client.address,
      company_Name: client.company_Name,
      project_Name: client.project_Name,
      phone: client.phone,
      createdDatetime: new Date(),
      updatedDatetime: new Date(),
      status: client.status || 'Active',
      state: client.state,
      gst_No: client.gst_No
    };

    return this.http.post<ClientResponse>(`${this.apiUrl}/AccountsAdmin/client`, clientData, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }


updateClient(id: number, client: Client): Observable<ClientResponse> {
  const clientData = {
    id: client.id,
    name: client.name,
    email: client.email,
    country: client.country,
    address: client.address,
    company_Name: client.company_Name,
    project_Name: client.project_Name,
    phone: client.phone,
    created_Datetime: client.created_Datetime || new Date(),
    updated_Datetime: new Date(),
    status: client.status || 'Active',
    state: client.state,
    gst_No: client.gst_No
  };

  return this.http.put<ClientResponse>(`${this.apiUrl}/AccountsAdmin/update/${id}`, clientData, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
}



 getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/AccountsAdmin/admins-name`);
  }

   getDepartments(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/AccountsAdmin/get-department`);
  }

   getPositionsTitle(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/AccountsAdmin/get-positions`);
  }

  saveContact(contactData: LicenseClientContact): Observable<LicenseClientContact> {
    return this.http.post<LicenseClientContact>(`${this.apiUrl}/AccountsAdmin/add-update-client-contact`, contactData);
  }


    saveAddress(addressData: ExchangeClientAddress): Observable<ExchangeClientAddress> {
    return this.http.post<ExchangeClientAddress>(`${this.apiUrl}/AccountsAdmin/add-update-client-address`, addressData);
  }

 deleteContact(contactId: number): Observable<any> {
    const url = `${this.apiUrl}/AccountsAdmin/delete/exchangeClientContact/${contactId}`;
    return this.http.delete(url);
}

 deleteAddress(addressID: number): Observable<any> {
    const url = `${this.apiUrl}/AccountsAdmin/delete/exchangeClientAddress/${addressID}`;
    return this.http.delete(url);
}

getCountries(): Observable<Country[]> {
    return this.http.get<AccountsCountry[]>(`${this.apiUrl}/AccountsAdmin/get-countries`)
      .pipe(
        map(countries => {
          const mappedCountries = countries.map(country => ({
            id: country.countryId,
            name: country.countryName,
            sortName: country.countryCode,
            phoneCode: country.dialCode
          }));

          const filtered = mappedCountries.filter(c =>
            c.name != null && typeof c.name === 'string' && c.name.trim() !== ''
          );

         // filtered.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));

          return filtered;
        }),
        catchError(error => {
          console.error('Error in getCountries:', error);
          return throwError(() => error);
        })
      );
  }



  // getRoles(): Observable<NetRoles[]> {
  //   return this.http.get<NetRoles[]>(`${this.apiUrl}/Exchanges/roles`)   
  //  }
  
   getRoles(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/License/roles`);
  }


getStatesByCountry(countryId: number): Observable<State[]> {
  console.log('Getting states for countryId:', countryId);

  return this.http.get<any[]>(`${this.apiUrl}/AccountsAdmin/get-states-by-country/${countryId}`)
    .pipe(
      map(response => {
        console.log('States API response:', response);
        if (Array.isArray(response)) {
          return response.map((state: any, index: number) => ({
            id: state.id,
            name: state.name || state.Name,
            countryId: countryId
          }));
        }
        return [];
      }),
      map((states: State[]) => states.sort((a, b) => a.name.localeCompare(b.name))),
      catchError(this.handleError)
    );
}

  getStatesByCountryName(countryName: string): Observable<State[]> {
  console.log('Fetching states for country:', countryName); 

  return this.http.get<any>(`${this.apiUrl}/AccountsAdmin/states-by-country/${countryName}`)
    .pipe(
      map(response => {
        console.log('States API response:', response); 

        if (Array.isArray(response)) {
          return response.map((state: any, index: number) => ({
            id: index + 1,
            name: state.Name || state.name,
            countryId: 0
          }));
        }
        return [];
      }),
      map((states: State[]) => {
        const sortedStates = states.sort((a, b) => a.name.localeCompare(b.name));
        console.log('Processed states:', sortedStates);
        return sortedStates;
      }),
      catchError(this.handleError)
    );
  }

  getTimezones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/AccountsAdmin/timezonelist`)
      .pipe(
        map(timezones => timezones || []),
        catchError(this.handleError)
      );
  }

  getClients(): Observable<Client[]> {
    return this.http.get<ApiResponse<Client[]>>(`${this.apiUrl}/AccountsAdmin/clients`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  getClientById(id: number): Observable<Client> {
  console.log('Fetching client by ID:', id);

  return this.http.get<ApiResponse<Client>>(`${this.apiUrl}/AccountsAdmin/clients/${id}`)
    .pipe(
      map(response => {
        console.log('API response for getClientById:', response);

        if (!response) {
          console.error('No response received from API');
          throw new Error('No response received from API');
        }

        if (response.data) {
          console.log('Client data from response.data:', response.data);
          return response.data;
        } else {

          console.log('Client data from response directly:', response);
          return response as any;
        }
      }),
      catchError(error => {
        console.error('Error in getClientById:', error);
        return this.handleError(error);
      })
    );
}


getLicenseContactClientById(licenseId: number ): Observable<LicenseClientContact> {
  console.log('Fetching client by ID:', licenseId);
 const params: any = {};
  if (licenseId !== undefined && licenseId !== null) params.licenseId = licenseId;
  //if (exchangeClientId !== undefined && exchangeClientId !== null) params.exchangeClientId = exchangeClientId;
  return this.http.get<ApiResponse<LicenseClientContact>>(`${this.apiUrl}/AccountsAdmin/get-license-client-contacts-by-id`,
      { params })
    .pipe(
      map(response => {
        console.log('API response for getClientById:', response);

        if (!response) {
          console.error('No response received from API');
          throw new Error('No response received from API');
        }

        if (response.data) {
          console.log('Client data from response.data:', response.data);
          return response.data;
        } else {
          console.log('Client data from response directly:', response);
          return response as any;
        }
      }),
      catchError(error => {
        console.error('Error in getClientById:', error);
        return this.handleError(error);
      })
    );
}

getLicenseContactClientByLicenseId( licenseClientId?: number): Observable<LicenseClientContact> {
  console.log('Fetching client by ID:',  licenseClientId);
  const params: any = {};
  //if (id !== undefined && id !== null) params.id = id;
  if (licenseClientId !== undefined && licenseClientId !== null) params.licenseClientId = licenseClientId;

  return this.http.get<ApiResponse<LicenseClientContact>>(
      `${this.apiUrl}/AccountsAdmin/get-license-client-contacts-by-id`,
      { params }
    ).pipe(
      map(response => {
        console.log('API response for getClientById:', response);

        if (!response) {
          console.error('No response received from API');
          throw new Error('No response received from API');
        }

        if (response.data) {
          console.log('Client data from response.data:', response.data);
          return response.data;
        } else {
          console.log('Client data from response directly:', response);
          return response as any;
        }
      }),
      catchError(error => {
        console.error('Error in getClientById:', error);
        return this.handleError(error);
      })
    );
}

getExchangeAddressClientById(id: number): Observable<ExchangeClientAddress> {
  console.log('Fetching client by ID:', id);

  return this.http.get<ApiResponse<ExchangeClientAddress>>(`${this.apiUrl}/AccountsAdmin/get-exchange-client-address/${id}`)
    .pipe(
      map(response => {
        console.log('API response for getClientById:', response);
        if (!response) {
          console.error('No response received from API');
          throw new Error('No response received from API');
        }

        if (response.data) {
          console.log('Client data from response.data:', response.data);
          return response.data;
        } else {
          
          console.log('Client data from response directly:', response);
          return response as any;
        }
      }),
      catchError(error => {
        console.error('Error in getClientById:', error);
        return this.handleError(error);
      })
    );
}

  deleteClient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/AccountsAdmin/clients/${id}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {

      errorMessage = `Error: ${error.error.message}`;
    } else {

      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }

    console.error('ClientService Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
