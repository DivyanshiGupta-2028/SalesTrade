import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { EstimateService } from '../../../services/Estimate/estimate-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DialogContentComponent, DialogData } from '../../dialog-content-component/dialog-content-component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepicker, MatDateRangePicker } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
 
export interface estimateModel{
id: number;
payment_Status: string
}
@Component({
  selector: 'app-view-estimate',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,          
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,], 
  templateUrl: './view-estimate.html',
  styleUrl: './view-estimate.scss',

})
export class ViewEstimate implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('filterPopover') filterPopover!: MatDatepicker<any>;
  @ViewChild('filterBtn') filterBtn!: ElementRef<HTMLButtonElement>;
  estimates: any[] = [];
  estimate:estimateModel[] =[];
  activeTab: string = 'all';
  showSearchBar: boolean = false;
  filteredSearchEstimates: any[] = [];
  searchTerm: string = '';
  filteredDateEstimates:any[] = [];
  dateRange: { start: Date | null; end: Date | null } = { start: null, end: null };
showFilter = false;


  private estimateService = inject(EstimateService);
 private dialog = inject(MatDialog);
  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
  this.loadEstimates();
}

private loadEstimates(): void {
  this.estimateService.getAllEstimates().subscribe({
    next: (data) => {
      this.estimates = data;
    },
    error: (err) => {
      console.error('Error fetching estimates:', err);
      this.toastr.error('Failed to load estimates', 'Error');
    }
  });
}
  openFilterPopover(): void {
    this.filterPopover.open();          
  }

  normalizeStatus(payment_Status: string | null | undefined): string {
  if (!payment_Status) return 'PENDING'; 
  const normalized = payment_Status.trim().toUpperCase();
  const statusMap: { [key: string]: string } = {
    'PAID': 'PAYMENT DONE',
    'PARTIALLY PAID': 'Partially Paid',
    'PENDING': 'PENDING'
  };

  return statusMap[normalized] || normalized;
}


getPaymentActionText(payment_Status: string | null | undefined): string {
  const status = this.normalizeStatus(payment_Status);
  return status === 'PAYMENT DONE' ? 'Record Payment' : 'Mark as Paid';
}

handlePaymentAction(estimate: estimateModel) {
  const status = this.normalizeStatus(estimate?.payment_Status);
  if (status === 'PAYMENT DONE') {
    this.recordPayment(estimate);
  } else {
    this.confirmBox(estimate);
  }
}

recordPayment(estimate: estimateModel) {
  // Abhi ke liye alert, baad mein payment form kholo
  alert(`Recording payment for Estimate #${estimate.id}`);
  // this.openPaymentModal(estimate);
}
  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  trackById(index: number, estimate: any): any {
    return estimate.id;
  }

  exportPdf(estimate: any): void {
    this.cdr.detectChanges();
    setTimeout(() => {
      const id = `estimate-row-${estimate.id}`;
      const element = document.getElementById(id);

      if (!element) {
        alert('Invoice row not in DOM. Please scroll to it and try again.');
        return;
      }

      html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#fff' })
        .then(canvas => {
          const imgWidth = 190;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          const pdf = new jsPDF('p', 'mm', 'a4');
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, imgWidth, imgHeight);
          pdf.save(`Estimate${estimate.id}.pdf`);
        })
        .catch(err => {
          console.error('PDF Error:', err);
          alert('Failed to generate PDF');
        });
    }, 200);
  }

  edit(estimate: any): void {
    this.router.navigate(['/estimates/edit', estimate.id]);
  }

clearDateFilter(): void {
    this.dateRange = { start: null, end: null };
  }


  confirmBox(estimate:estimateModel) {
     const dialogRef: MatDialogRef<DialogContentComponent, boolean> = this.dialog.open(DialogContentComponent, {
      width: '400px',
      data: {
        title: 'Are you sure?',
        message: 'Confirm to mark as - "PAID"',
        confirmText: 'YES',
        cancelText: 'NO'
      }  as DialogData
    });
  dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
  if (confirmed) {
    this.markAsPaid(estimate);   
  } else {
    console.log(confirmed)
    console.log('Cancelled');
  }
});
  }

  markAsPaid(estimate: estimateModel) {
  this.estimateService.markPaid({
    id: estimate.id ?? 0,
    payment_Status: estimate.payment_Status
  }).subscribe({
    next: (res) => {
      console.log(res.message);
      estimate.payment_Status = "paid";

      this.toastr.success('Successfully marked as paid!', 'Success', {
        timeOut: 3000
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    error: (err) => {
      console.error('Failed to mark paid', err);
      this.toastr.error('Failed to mark as paid', 'Error', {
        timeOut: 3000
      });
    }
  });
}


  delete(estimate: any): void {
    if (!confirm(`Delete invoice #${estimate.id}?`)) return;

    this.estimateService.deleteEstimate(estimate.id).subscribe({
      next: () => {
        this.estimates = this.estimates.filter(i => i.id !== estimate.id);
        this.filteredSearchEstimates = this.filteredSearchEstimates.filter(i => i.id !== estimate.id);
      },
      error: err => alert('Delete failed')
    });
  }

  toggleSearch() {
    this.showSearchBar = !this.showSearchBar;
    if (this.showSearchBar) {
      setTimeout(() => {
        this.searchInput?.nativeElement.focus();
      }, 100);
    } else {
      this.searchTerm = '';
    }
  }
  get filteredEstimates(): any[] {
    let result = this.estimates;

    if (this.activeTab === 'pending') {
      result = result.filter(e => this.normalizeStatus(e.payment_Status) === 'PENDING');
    } else if (this.activeTab === 'paid') {
      result = result.filter(e => this.normalizeStatus(e.payment_Status) === 'PAYMENT DONE');
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(e => {
        return (
          (e.id?.toString().toLowerCase().includes(term)) ||
          (e.client_Name?.toLowerCase().includes(term)) ||
          (e.estimate_Amount?.toString().includes(term)) ||
          (e.member_Name?.toLowerCase().includes(term)) ||
          (e.invoiceDate?.toString().toLowerCase().includes(term)) ||
          (e.payment_Status?.toString().includes(term))
        );
      });
    }

     if (this.dateRange.start && this.dateRange.end) {
    const start = this.dateRange.start;
    const end = this.dateRange.end;

    result = result.filter(e => {
      if (!e.invoiceDate) return false;
      const invoiceDate = new Date(e.invoiceDate);
      return invoiceDate >= start && invoiceDate <= end;
    });
  }

    return result;
  }
}