import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InvoiceFormatService } from '../../../services/Invoice/invoice-format-service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-select-format',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select-format.html',
  styleUrl: './select-format.scss'
})
export class SelectFormat {
  formats: any[] = [];
  selectedFormatId: number | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { },
    private dialogRef: MatDialogRef<SelectFormat>,
    private formatService: InvoiceFormatService
  ) {
    this.loadFormats();
  }

  loadFormats() {
    this.formatService.getInvoiceFormatsByCompany().subscribe(res => {
      this.formats = res;
      const defaultFmt = res.find(f => f.isDefault);
      this.selectedFormatId = defaultFmt?.id || res[0]?.id;
    });
  }

  confirmSelection() {
    if (this.selectedFormatId) {
      this.dialogRef.close(this.selectedFormatId);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
