export interface InvoiceFormat {
  id: number;
  formatName: string;
  invoiceNumberPattern: string;
  defaultCurrency: string;
  taxDetails: string;
  itemColumns: string;
  createdAt: string;
isDefault?: boolean; 
}
