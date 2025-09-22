import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../../services/Invoice/invoice-service';

@Component({
  selector: 'app-invoice-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-summary.html',
  styleUrl: './invoice-summary.scss'
})
export class InvoiceSummary  implements OnInit {
 user = {
    name: 'Beauty',
    email: 'beauty@sanskriti-tech.in',
    totalSales: 0
  };


  constructor(private invoiceService: InvoiceService) {}



  calculateTotal(invoices: any[]): number {
    return invoices.reduce((total, invoice) => total + (invoice.amount || 0), 0);
  }

  ngOnInit() {
  this.invoiceService.getAllRecordPayments().subscribe(data => {
    this.invoices = data;
     this.user.totalSales = this.calculateTotal(data);
  });
}

  invoices: any[] = [];
}
