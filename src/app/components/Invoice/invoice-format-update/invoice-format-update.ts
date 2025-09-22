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
  id!: number;
formatData: ExtendedInvoiceFormat = {
  id: 0,
  formatName: '',
  invoiceNumberPattern: '',
  defaultCurrency: 'USD',
  taxDetails: '',
  itemColumns: '',
  createdAt: '',

  taxDetailsParsed: { cgst: 0, sgst: 0, igst: 0 },
  itemColumnsParsed: [{key:'', visible:true}],


};


  constructor(
    private route: ActivatedRoute,
    private formatService: InvoiceFormatService,
    private router: Router
  ) {}
ngOnInit(): void {


this.route.params.subscribe(params => {
      const routeFormatId = params['id'];
      if (routeFormatId) {
        this.id = +routeFormatId;
        this.loadFormat(this.id);
      } else {
      }
    });
}


  private loadFormat(id: number): void {

  this.formatService.getInvoiceFormatsById(id).subscribe({
    next: (format) => {
      if (format) {
        this.formatData = {
          ...format,
          taxDetailsParsed: format.taxDetails
            ? JSON.parse(format.taxDetails)
            : { cgst: 0, sgst: 0, igst: 0 },
          itemColumnsParsed: format.itemColumns
            ? JSON.parse(format.itemColumns)
            : []
        };
      } else {
         this.formatData = {
    id: 0,
    formatName: '',
    invoiceNumberPattern: '',
    defaultCurrency: 'USD',
    taxDetails: '',
    itemColumns: '',
    createdAt: '',
    taxDetailsParsed: { cgst: 0, sgst: 0, igst: 0 },
    itemColumnsParsed: []
  };
}
},
    error: (error) => {
      console.error('Error loading format:', error);
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
