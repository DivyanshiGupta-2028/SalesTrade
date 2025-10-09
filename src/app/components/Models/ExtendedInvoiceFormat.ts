
import { InvoiceFormat } from './InvoiceFormat';

export interface ExtendedInvoiceFormat extends InvoiceFormat {
  taxDetailsParsed?: {
    cgst: number;
    sgst: number;
    igst: number;
  };
  itemColumnsParsed: { key: string; visible: boolean }[];
}
export interface ExtendedInvoiceFormat {
  id: number;
  formatName: string;
  invoiceNumberPattern: string;
  defaultCurrency: string;
  taxDetails: string;
  itemColumns: string;
  createdAt: string;

}
