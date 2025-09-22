import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-create-invoice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-invoice.html',
  styleUrl: './create-invoice.scss'
})
export class CreateInvoice {
   invoices: any = {
    amount_date: '02-07-2025',
    // other mock or real values
  };

member = {
    company_name: 'Sanskriti IT Solutions Pvt. Ltd.',
    address: '123, Business Park, Bhopal',
    gst_no: '29ABCDE1234F2Z5',
    email: 'info@sanskriti.com',
    state_name: 'Madhya Pradesh',
    state_code: '23',
    pan_no: 'ABCDE1234F',
    cin_no: 'U12345MP2021PTC000000',
  };

  client_data = {
    name: 'Beauty Shrivastava',
    company_name: 'Client Co.',
    email: 'client@example.com',
    address: 'Client Address, Delhi',
    state_name: 'Delhi',
    state_code: '07',
    country: '101',
    country_name: 'India',
    gst_no: '07ABCDE1234F1Z5'
  };

  estimate_data = {
    invoice_number: 'INV-00123',
    amount_date: new Date(),
    currency: 'INR',
    description: 'Software Development',
  };

  estimate_data_prices = [
    { description: 'Development Work', qty: 10, price: 500 },
    { description: 'Consultation', qty: 5, price: 800 }
  ];

  bank = {
    name: 'HDFC Bank',
    account_type: 'Current',
    account_no: '123456789012',
    swift: 'HDFCINBBXXX',
  };

  currency_cur = 'INR';

  getTotal(): number {
    return this.estimate_data_prices.reduce((sum, item) => sum + (item.qty * item.price), 0);
  }

  getGST(): number {
    const total = this.getTotal();
    if (this.client_data.country === '101') {
      return this.client_data.state_code === '9'
        ? Math.ceil(total * 9 / 100) * 2
        : Math.ceil(total * 18 / 100);
    }
    return 0;
  }

  numberToWords(value: number): string {
    // You can use a number-to-words pipe or helper function here
    return value + ' only';
  }
}
