// src/app/components/Models/ExtendedInvoiceFormat.ts
import { InvoiceFormat } from './InvoiceFormat';

export interface ExtendedInvoiceFormat extends InvoiceFormat {
  taxDetailsParsed?: {
    cgst: number;
    sgst: number;
    igst: number;
  };
  itemColumnsParsed?: {
    key: string;
    // label: string;
  }[];
}
