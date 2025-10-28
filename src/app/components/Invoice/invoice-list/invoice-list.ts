import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../../services/Invoice/invoice-service';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  filteredInvoices: any[] = []; 
  searchTerm: string = '';


  constructor(private invoiceService: InvoiceService, private router:Router,   private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.invoiceService.getAllRecordPayments().subscribe({
      next: (data) => { this.recordPayments = data,
      this.filteredInvoices = data; 
      },
      error: (err) => console.error('Error fetching payments:', err)
    });
  }
  trackById(index: number, record: any): any {
    return record.id;
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }
// exportPdf(record: any): void {
//   setTimeout(() => {
//     const element = document.getElementById(`invoice-row-${record.id}`);
//     console.log('Looking for:', `invoice-row-${record.id}`);
// console.log('Found:', document.getElementById(`invoice-row-${record.id}`));
//     if (!element) {
//       console.warn('Element not found:', `invoice-row-${record.id}`);
//       alert('Invoice not visible. Try scrolling to it first.');
//       return;
//     }

//     html2canvas(element, { scale: 2, useCORS: true }).then(canvas => {
//       const imgWidth = 190;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       const pdf = new jsPDF('p', 'mm', 'a4');
//       pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, imgWidth, imgHeight);
//       pdf.save(`Invoice_${record.id}.pdf`);
//     }).catch(err => {
//       console.error(err);
//       alert('PDF generation failed');
//     });
//   }, 150);
// }


exportPdf(record: any): void {
    // Force change detection
    this.cdr.detectChanges();

    // Wait for DOM to update
    setTimeout(() => {
      const id = `invoice-row-${record.id}`;
      const element = document.getElementById(id);

      // console.log('Looking for ID:', id);
      // console.log('Found element:', element);

      if (!element) {
        alert('Invoice row not in DOM. Please scroll to it and try again.');
        return;
      }

      html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#fff' })
        .then(canvas => {
          const imgWidth = 190;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          const pdf = new jsPDF('p', 'mm', 'a4');
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, imgWidth, imgHeight);
          pdf.save(`Invoice_${record.id}.pdf`);
        })
        .catch(err => {
          console.error('PDF Error:', err);
          alert('Failed to generate PDF');
        });
    }, 200); 
  }

  edit(record: any): void {
    this.router.navigate(['/invoices/edit', record.id]);
  }

  delete(record: any): void {
    if (!confirm(`Delete invoice #${record.id}?`)) return;

    this.invoiceService.deleteRecordPayment(record.id).subscribe({
      next: () => {
        this.recordPayments = this.recordPayments.filter(i => i.id !== record.id);
        this.filteredInvoices = this.filteredInvoices.filter(i => i.id !== record.id);
      },
      error: err => alert('Delete failed')
    });
  }

  search() {
    if (!this.searchTerm.trim()) {
      this.filteredInvoices = [...this.recordPayments];
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();

    this.filteredInvoices = this.recordPayments.filter(record => {
      return (
        (record.id ?.toString().includes(term)) || 
        (record.estimate_Amount?.toString().includes(term)) ||
        (record.name?.toLowerCase().includes(term)) ||
        (record.tds?.toString().includes(term)) ||
        (record.date?.toString().includes(term)) ||
        (record.amount?.toString().includes(term)) ||
        (record.categoryTitle?.toLowerCase().includes(term))
      );
    });
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
