import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExtendedInvoiceFormat } from '../../Models/ExtendedInvoiceFormat';
import { InvoiceFormatService } from '../../../services/Invoice/invoice-format-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-format-list',
 standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-format-list.html',
  styleUrl: './invoice-format-list.scss'
})
export class InvoiceFormatList {

   @Input() formats: ExtendedInvoiceFormat[] = [];
 constructor(private formatService: InvoiceFormatService, private router: Router) {}

  ngOnInit() {
    this.loadFormats();
  }

  loadFormats() {
 this.formatService.getInvoiceFormatsByCompany().subscribe((res: any[]) => {
  console.log('Raw Formats:', res);

  this.formats = res.map(f => {
    let taxParsed = null;
    let columnsParsed = null;

    try {
      taxParsed = typeof f.taxDetails === 'string' ? JSON.parse(f.taxDetails) : f.taxDetails;
    } catch (err) {
      console.error('Invalid taxDetails JSON for format:', f.formatName, f.taxDetails);
    }

    try {
      columnsParsed = typeof f.itemColumns === 'string' ? JSON.parse(f.itemColumns) : f.itemColumns;
    } catch (err) {
      console.error('Invalid itemColumns JSON for format:', f.formatName, f.itemColumns);
    }

    return {
      ...f,
      taxDetailsParsed: taxParsed,
      itemColumnsParsed: columnsParsed
    } as ExtendedInvoiceFormat;
  });
});


  }





  onAddClick() {
   this.router.navigate(['/invoice-format-manager']);
  }

onEditFormat(format: ExtendedInvoiceFormat) {
  this.router.navigate(['/invoice-format-update'], {
    queryParams: { id: format.id }
  });
}


onDeleteFormat(id: number) {
  if (confirm('Are you sure you want to delete this format?')) {
    this.formatService.deleteInvoiceFormat(id).subscribe(() => {
      this.loadFormats();
    });
  }
}





}
