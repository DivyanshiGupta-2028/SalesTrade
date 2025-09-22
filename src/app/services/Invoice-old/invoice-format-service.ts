import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { InvoiceFormat } from '../../components/Models/InvoiceFormat';

@Injectable({
  providedIn: 'root'
})
export class InvoiceFormatService {

   private apiUrl = `${environment.apiUrl}`; // update if different

  constructor(private http: HttpClient) {}

  addInvoiceFormat(format: any) {
    return this.http.post(`${this.apiUrl}/AccountsAdmin/add-invoice-format`, format);
  }




getInvoiceFormatsByCompany(): Observable<InvoiceFormat[]> {
  return this.http.get<InvoiceFormat[]>(`${this.apiUrl}/AccountsAdmin/invoice-formats`);
}

deleteInvoiceFormat(id: number) {
  return this.http.delete(`${this.apiUrl}/AccountsAdmin/delete/${id}`);
}
  updateInvoiceFormat(id: number, format: InvoiceFormat): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/AccountsAdmin/update-invoice-format/${id}`, format);
  }

}
