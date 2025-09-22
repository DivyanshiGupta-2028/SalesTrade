import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SenderDetails } from '../../../services/SenderDetails/sender-details';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../services/Client/client-service';
import { FormsModule } from '@angular/forms';
import { InvoiceFormatService } from '../../../services/Invoice/invoice-format-service';
import { EstimateService } from '../../../services/Estimate/estimate-service';

@Component({
  selector: 'app-add-estimate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-estimate.html',
  styleUrl: './add-estimate.scss'
})
export class AddEstimate implements OnInit {
totalAmountInWords: string = '';
currencies: string[] = [];

//  selectedFormatId = 1;
  sender: any = null;
  clientId: string | null = null;
todayDate = new Date();
 clients: any[] = [];
 banks: any[] = [];

 estimateNumber = '';
availableFormats: any[] = [];
defaultFormat: any = null;
selectedFormatId: number | null = null;
currency: string = 'INR'; // default fallback

columns = [
  { "key": "description", "visible": true },
  { "key": "quantity", "visible": true },
  { "key": "rate", "visible": true },
  { "key": "sacCode", "visible": true }
]



invoiceItems: { [key: string]: any }[] = [
  { description: '', quantity: '', rate: '', sacCode: '998314' }
];


newColumnLabel = '';
  private senderService = inject(SenderDetails);


  constructor(
  private route: ActivatedRoute,
  private cdr: ChangeDetectorRef,
  private clientService: ClientService,
  private router: Router,
  private formatService: InvoiceFormatService,
  private estimateService: EstimateService
) {}

ngOnInit() {
   this.clientId = this.route.snapshot.paramMap.get('id');
  const formatId = this.route.snapshot.queryParamMap.get('formatId');

  if (formatId) {
    this.selectedFormatId = +formatId;
  }
this.estimateService.getAllEstimates().subscribe({
  next: (estimates) => {
    const allCurrencies = estimates
      .map((e: any) => e.currency)
      .filter(Boolean);
  this.currencies = [...new Set(allCurrencies)] as string[];
 if (!this.currencies.includes(this.currency)) {
      this.currency = this.currencies[0] || 'INR';
    }

  },
  error: (err) => {
    console.error('Failed to load estimates for currencies:', err);
  }
});

  this.loadInvoiceFormat();
  this.generateEstimateNumber();

   this.clientService.getAllClients().subscribe({
      next: (data) => this.clients = data,
      error: (err) => console.error('Failed to fetch clients:', err)
    });
 this.estimateService.getAllBanks().subscribe({
      next: (data) => this.banks = data,
      error: (err) => console.error('Failed to fetch banks:', err)
    });
  this.senderService.getAllSenders().subscribe({
    next: (data) => {
      this.sender = data[0];
      console.log('Sender:', this.sender);
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Failed to load sender', err);
    }
  });

}





generateEstimateNumber() {
  const now = new Date();
  const random = Math.floor(Math.random() * 1000);
  const formatted = `EST ${now.getFullYear()}${now.getMonth()+1}${now.getDate()}-${random}`;
  this.estimateNumber = formatted;
}
addInvoiceItem() {
  this.invoiceItems.push({ description: '', quantity: '', rate: '', sacCode: '' });
}

removeInvoiceItem(index: number) {
  this.invoiceItems.splice(index, 1);
}
editItem(index: number) {
  console.log('Edit item at index:', index);
}
addColumn() {
  const label = this.newColumnLabel.trim();
  if (!label) return;

  const key = label.toLowerCase().replace(/[^a-z0-9]/g, '_');
  if (this.columns.find(c => c.key === key)) return;

  this.columns.push({ key, visible: true });
  this.invoiceItems.forEach(item => (item[key] = ''));
  this.newColumnLabel = '';
}
get visibleColumns(): { key: string; visible: boolean }[] {
  return this.columns.filter((c) => c.visible);
}




loadInvoiceFormat() {
  this.formatService.getInvoiceFormatsByCompany().subscribe((formats: any[]) => {
    this.availableFormats = formats;

    const defaultFmt = formats.find(f => f.isDefault);
    this.defaultFormat = defaultFmt;

    const selected = this.selectedFormatId || defaultFmt?.id || formats[0]?.id;
    this.selectedFormatId = selected;

    this.applyFormatById(selected);
  });
}


applyFormatById(formatId: number) {
  const selected = this.availableFormats.find(f => f.id === formatId);
  if (selected) {
    const parsedColumns = JSON.parse(selected.itemColumns || '[]');

    this.columns = parsedColumns.map((col: any) => ({
      key: col.key,
      visible: col.visible,
      info: col.info || ''
    }));

    this.invoiceItems = [
      Object.fromEntries(this.columns.map(col => [col.key, '']))
    ];

    this.currency = selected.defaultCurrency || 'INR';
  }
}



getItemTotal(item: any): number {
  const quantity = parseFloat(item.quantity) || 0;
  const rate = parseFloat(item.rate) || 0;
  return quantity * rate;
}

getTotalAmmount(): number {
  const total = this.invoiceItems.reduce((total, item) => total + this.getItemTotal(item), 0);
  this.totalAmountInWords = this.convertNumberToWords(total);
  return total;
}
convertNumberToWords(amount: number): string {
  const words = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (amount === 0) return 'Zero';

  const num = Math.floor(amount);
  const paisa = Math.round((amount - num) * 100);

  const numToWords = (n: number): string => {
    if (n < 20) return words[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + words[n % 10] : '');
    if (n < 1000) return words[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + numToWords(n % 100) : '');
    if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
    if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numToWords(n % 100000) : '');
    return numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numToWords(n % 10000000) : '');
  };

  const result = numToWords(num) + ' Rupees';
  if (paisa > 0) return result + ' and ' + numToWords(paisa) + ' Paise';
  return result;
}

}

