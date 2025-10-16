import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../../services/Invoice/invoice-service';



@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.html',
  styleUrls: ['./invoice-list.scss'],
  standalone: true,
   imports: [CommonModule,
    FormsModule,

  ]
})
export class InvoiceList  implements OnInit {
  recordPayments: any[] = [];
  searchText: string = '';
  activeTab: string = 'all';

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.invoiceService.getAllRecordPayments().subscribe({
      next: (data) => this.recordPayments = data,
      error: (err) => console.error('Error fetching payments:', err)
    });
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  get filteredPayments(): any[] {
    return this.recordPayments.filter(record => {
      const matchesSearch = this.searchText === '' ||
        record.invoiceNumber?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        record.clientName?.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesTab =
        this.activeTab === 'all' ||
        (this.activeTab === 'gst' && record.type === 'GST') ||
        (this.activeTab === 'intl' && record.type === 'INTL');

      return matchesSearch && matchesTab;
    });
  }
}
