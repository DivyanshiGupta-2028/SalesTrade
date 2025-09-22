import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceFormatService } from '../../../services/Invoice/invoice-format-service';
import { ExtendedInvoiceFormat } from '../../Models/ExtendedInvoiceFormat';

@Component({
  selector: 'app-invoice-format-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-format-update.html',
  styleUrl: './invoice-format-update.scss'
})
export class InvoiceFormatUpdate implements OnInit {
  formatId!: number;
formatData: ExtendedInvoiceFormat = {
  id: 0,
  formatName: '',
  invoiceNumberPattern: '',
  defaultCurrency: 'USD',
  taxDetails: '',
  itemColumns: '',
  createdAt: '',


  taxDetailsParsed: { cgst: 0, sgst: 0, igst: 0 },
  itemColumnsParsed: [],

};


  constructor(
    private route: ActivatedRoute,
    private formatService: InvoiceFormatService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formatId = +this.route.snapshot.paramMap.get('id')!;
    this.loadFormat();
  }

  loadFormat() {
    this.formatService.getInvoiceFormatsByCompany().subscribe(formats => {
      const match = formats.find(f => f.id === this.formatId);
      if (match) {
        this.formatData = {
          ...match,
          taxDetailsParsed: match.taxDetails ? JSON.parse(match.taxDetails) : { cgst: 0, sgst: 0, igst: 0 },
          itemColumnsParsed: match.itemColumns ? JSON.parse(match.itemColumns) : []
        };
      }
    });
  }

  updateFormat() {
    const payload = {
      id: this.formatData.id,
      formatName: this.formatData.formatName,
      invoiceNumberPattern: this.formatData.invoiceNumberPattern,
      defaultCurrency: this.formatData.defaultCurrency,
      taxDetails: JSON.stringify(this.formatData.taxDetailsParsed),
      itemColumns: JSON.stringify(this.formatData.itemColumnsParsed),
      createdAt: this.formatData.createdAt
    };

    this.formatService.updateInvoiceFormat( payload).subscribe(() => {
      this.router.navigate(['/invoice-format-list']);
    });
  }
}
