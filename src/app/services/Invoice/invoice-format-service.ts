import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { catchError, map, Observable } from 'rxjs';
import { InvoiceFormat } from '../../components/Models/InvoiceFormat';
import { ApiResponse } from '../../components/Models/Client.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceFormatService {

   private apiUrl = `${environment.apiUrl}`; 

  constructor(private http: HttpClient) {}

  addInvoiceFormat(format: any) {
    return this.http.post(`${this.apiUrl}/AccountsAdmin/add-invoice-format`, format);
  }

getInvoiceFormatsByCompany(): Observable<InvoiceFormat[]> {
  return this.http.get<InvoiceFormat[]>(`${this.apiUrl}/AccountsAdmin/get-invoice-formats`);
}


getInvoiceFormats(): Observable<InvoiceFormat[]> {
  return this.http.get<InvoiceFormat[]>(`${this.apiUrl}/AccountsAdmin/get-formats`);
}
getInvoiceFormatsById(id: number) {
 console.log('Fetching invoice by ID:', id);
  return this.http.get<InvoiceFormat>(`${this.apiUrl}/AccountsAdmin/get-invoice-formats-by-id/${id}`);
}


// getInvoiceFormatsyId(id:number): Observable<InvoiceFormat> {
//   console.log('Fetching client by ID:', id);

//   return this.http.get<ApiResponse<InvoiceFormat>>(`${this.apiUrl}/AccountsAdmin/get-invoice-formats-by-id/${id}`)
//   .pipe(
//       map(response => {
//         console.log('API response for getFormatById:', response);

//         if (!response) {
//           console.error('No response received from API');
//           throw new Error('No response received from API');
//         }

//         if (response.data) {
//           console.log('Invoice data from response.data:', response.data);
//           return response.data;
//         } else {

//           console.log('Invoice data from response directly:', response);
//           return response as any;
//         }
//       }),

//     );
// }

deleteInvoiceFormat(id: number) {
  return this.http.delete(`${this.apiUrl}/AccountsAdmin/delete/${id}`);
}
  updateInvoiceFormat( format: InvoiceFormat): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/AccountsAdmin/update-invoice-format`, format);
  }

}
