import { Component, OnInit } from '@angular/core';
import { InvoiceFormatService } from '../../../services/Invoice/invoice-format-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-format-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-format-manager.html',
  styleUrl: './invoice-format-manager.scss'
})
export class InvoiceFormatManager implements OnInit {
  companyId = 1;
  showAddForm = false;

  newFormat = {
    companyId: 1,
    formatName: '',
    invoiceNumberPattern: '',
    defaultCurrency: 'USD',
    taxDetails: {
      cgst: 0,
      sgst: 0,
      igst: 0
    },
    itemColumns: [
      { key: 'Description', visible: true },
      { key: 'Quantity', visible: true },
      { key: 'Rate', visible: true },
      { key: 'Amount', visible: true }
    ]
  };

  constructor(private formatService: InvoiceFormatService, private router: Router) {}

  ngOnInit() {}

  saveFormat() {
    const visibleColumns = this.newFormat.itemColumns.filter(col => col.visible);

    const formatToSend = {
      ...this.newFormat,
      taxDetails: JSON.stringify(this.newFormat.taxDetails),
      itemColumns: JSON.stringify(visibleColumns),
    };

    this.formatService.addInvoiceFormat(formatToSend).subscribe(() => {
     this.router.navigate(['/invoice-format-list']); // ⬅️ Navigate to route
    });
  }

  onAddFormatClicked() {
    this.showAddForm = true;
  }
}
