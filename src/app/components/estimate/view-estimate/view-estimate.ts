// import { CommonModule } from '@angular/common';
// import { ChangeDetectorRef, Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
// import { EstimateService } from '../../../services/Estimate/estimate-service';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import { ConfirmBoxEvokeService } from '@costlydeveloper/ngx-awesome-popup';
// import { IConfirmBoxPublicResponse,NgxAwesomePopupModule } from '@costlydeveloper/ngx-awesome-popup';
// import { DialogLayoutDisplay,ConfirmBoxInitializer} from '@costlydeveloper/ngx-awesome-popup';
// @Component({
//   selector: 'app-view-estimate',
//  standalone: true,
//   imports: [CommonModule, FormsModule,NgxAwesomePopupModule  ],
//   templateUrl: './view-estimate.html',
//   styleUrl: './view-estimate.scss',
//    providers: []
// })
// export class ViewEstimate implements OnInit {
//    @ViewChild('searchInput') searchInput!: ElementRef;
//   estimates: any[] = [];
//   activeTab: string = 'all';
//   showSearchBar: boolean = false;
//   filteredSearchEstimates: any[] = []; 
//   searchTerm: string = '';

//   private estimateService = inject(EstimateService);
// constructor(private confirmBoxEvokeService: ConfirmBoxEvokeService,private confirmBoxFactory: ConfirmBoxInitializer,private router:Router,   private cdr: ChangeDetectorRef) {}
//   ngOnInit(): void {
//     this.estimateService.getAllEstimates().subscribe({
//       next: (data) => this.estimates = data,
//       error: (err) => console.error('Error fetching estimates:', err)
//     });
//   }

//   normalizeStatus(status: string | null | undefined): string {
//   return (status?.toUpperCase().trim() || '').toUpperCase();
// }
//   switchTab(tab: string): void {
//     this.activeTab = tab;
//   }
// //   toggleSearch() {
// //   this.showSearchBar = !this.showSearchBar;
// //   if (this.showSearchBar) {
// //     setTimeout(() => this.searchInput.nativeElement.focus(), 0);
// //   } 
// // }
//   trackById(index: number, estimate: any): any {
//     return estimate.id;
//   }
// exportPdf(estimate: any): void {
//     // Force change detection
//     this.cdr.detectChanges();

//     // Wait for DOM to update
//     setTimeout(() => {
//       const id = `estimate-row-${estimate.id}`;
//       const element = document.getElementById(id);

//        console.log('Looking for ID:', id);
//        console.log('Found element:', element);

//       if (!element) {
//         alert('Invoice row not in DOM. Please scroll to it and try again.');
//         return;
//       }

//       html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#fff' })
//         .then(canvas => {
//           const imgWidth = 190;
//           const imgHeight = (canvas.height * imgWidth) / canvas.width;
//           const pdf = new jsPDF('p', 'mm', 'a4');
//           pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, imgWidth, imgHeight);
//           pdf.save(`Estiimate${estimate.id}.pdf`);
//         })
//         .catch(err => {
//           console.error('PDF Error:', err);
//           alert('Failed to generate PDF');
//         });
//     }, 200); 
//   }

//   edit(estimate: any): void {
//     this.router.navigate(['/estimates/edit', estimate.id]);
//   }

//   // confirmSuspend(license: LicenseActive) {
//   //   const isConfirmed = confirm("Are you sure you want to suspend this license?");
//   //   if (isConfirmed) {
//   //     this.onSuspend(license);
//   //   }
//   // }

// // confirmBox() {
// //     const confirmBox = new ConfirmBoxInitializer();
// //     confirmBox.setTitle('Are you sure?');
// //     confirmBox.setMessage('Confirm to mark as PAID');
// //     confirmBox.setButtonLabels('YES', 'NO');


// //     confirmBox.setConfig({
// //       layoutType: DialogLayoutDisplay.SUCCESS, //DANGER  | INFO | NONE | DANGER | WARNING
// //     });

// //     // Simply open the popup and listen which button is clicked
// //     confirmBox.openConfirmBox$().subscribe(resp => {
// //       console.log('Clicked button response: ', resp);
// //       const clickedButton = resp.clickedButtonID;
// //       if (clickedButton === 'YES') {
// //         console.log('PAID');
// //         // Call delete logic
// //       } else {
// //         console.log('PENDING');
// //       }
// //     });
// //   }


// // confirmBox() {
// //     const confirmBox = this.confirmBoxFactory; // Already injected!

// //     confirmBox.setTitle('Are you sure?');
// //     confirmBox.setMessage('Confirm to mark as PAID');
// //     confirmBox.setButtonLabels('YES', 'NO');
// //     confirmBox.setConfig({
// //       layoutType: DialogLayoutDisplay.SUCCESS
// //     });

// //     confirmBox.openConfirmBox$().subscribe((resp: IConfirmBoxResponse) => {
// //       console.log('Clicked button response: ', resp);
// //       if (resp.clickedButtonID === 'YES') {
// //         console.log('PAID');
// //         this.markAsPaid();
// //       } else {
// //         console.log('PENDING');
// //       }
// //     });
// //   }

// //   markAsPaid() {
// //     // Your API call here
// //     console.log('Estimate marked as PAID');
// //   }

// confirmBox() {
//     this.confirmBoxEvokeService.evoke({
//       title: 'Are you sure?',
//       message: 'Confirm to mark as PAID',
//       cancel: 'NO',
//       confirm: 'YES',
//       layout: DialogLayoutDisplay.SUCCESS
//     }).subscribe((resp: IConfirmBoxPublicResponse) => {
//       if (resp.Success) {  // ← Use .success, not .clicked
//       this.markAsPaid();
//       } else {
//         console.log('Cancelled');
//       }
//     });
//   }


//   markAsPaid(): void{
//     console.log('Estimate marked as PAID');
//     // Call your API
//   }

//   // onSuspend(license: LicenseActive) {
//   //   this.licenseService.suspendLicense({
//   //   licenseId: license.licenseId ?? 0,
//   //   isActive: license.isActive,
//   //   Renewal: false,
//   // }).subscribe({
//   //     next: (res) => {
//   //       console.log(res.message);
//   //       license.isActive = false;
//   //      this.toastr.success('Succesfully suspended license', 'Success',
//   //  {
//   //    timeOut: 3000
//   //  }
//   // );
//   //  setTimeout(() => {
//   //           window.location.reload();
//   //         }, 2000); 
//   //     },
//   //     error: (err) => {
//   //       console.error('Suspend failed', err);
//   //       this.toastr.error('Failed to suspend license', 'Error', {
//   //           timeOut: 3000
//   //         });
//   //     },
//   //   });
//   // }

//   delete(estimate: any): void {
//     if (!confirm(`Delete invoice #${estimate.id}?`)) return;

//     this.estimateService.deleteEstimate(estimate.id).subscribe({
//       next: () => {
//         this.estimates = this.estimates.filter(i => i.id !== estimate.id);
//         this.filteredSearchEstimates = this.filteredSearchEstimates.filter(i => i.id !== estimate.id);
//       },
//       error: err => alert('Delete failed')
//     });
//   }

// toggleSearch() {
//     this.showSearchBar = !this.showSearchBar;

//     if (this.showSearchBar) {
//       // Wait for DOM to render input
//       setTimeout(() => {
//         if (this.searchInput?.nativeElement) {
//           this.searchInput.nativeElement.focus();
//         }
//       }, 100); // 100ms safe delay
//     } else {
//       this.searchTerm = '';
//     }
//   }
// // else {
// //     this.clearSearch();
// //   }
//  search() {
//     if (!this.searchTerm.trim()) {
//       this.filteredSearchEstimates = this.estimates;
//       return;
//     }

//     const term = this.searchTerm.toLowerCase();

//     this.filteredSearchEstimates = this.estimates.filter(est => {
//       return (
//         (est.id?.includes(term)) ||
//         (est.client_Name?.toLowerCase().includes(term)) ||
//         (est.estimate_Amount?.toString().includes(term)) ||
//         (est.member_Name?.toString().includes(term)) ||
//         (est.invoiceDate?.toString().includes(term)) ||
//         (est.payment_Status?.toString().includes(term)) 
//       );
//     });
//   }
// //  get filteredEstimates(): any[] {
// //   if (this.activeTab === 'all') return this.estimates;
// //   if (this.activeTab === 'due') {
// //     return this.estimates.filter(e => e.payment_Status?.toLowerCase() === 'pending');
// //   }
// //   if (this.activeTab === 'paid') {
// //     return this.estimates.filter(e => e.payment_Status?.toLowerCase() === 'payment done');
// //   }
// //   return this.estimates;
// // }


// get filteredEstimates(): any[] {
//   let result = this.estimates;

//   // 1. Apply Tab Filter
//   if (this.activeTab === 'due') {
//     result = result.filter(e => this.normalizeStatus(e.payment_Status) === 'PENDING');
//   } else if (this.activeTab === 'paid') {
//     result = result.filter(e => this.normalizeStatus(e.payment_Status) === 'PAYMENT DONE');
//   }
//   // 'all' → no filter

//   // 2. Apply Search Filter
//   if (this.searchTerm.trim()) {
//     const term = this.searchTerm.toLowerCase().trim();
//     result = result.filter(e => {
//       return (
//         (e.id?.toString().toLowerCase().includes(term)) ||
//         (e.client_Name?.toLowerCase().includes(term)) ||
//         (e.estimate_Amount?.toString().includes(term)) ||
//         (e.member_Name?.toLowerCase().includes(term)) ||
//         (e.invoiceDate?.toString().toLowerCase().includes(term))||
//         (e.payment_Status?.toString().includes(term))
//       );
//     });
//   }

//   return result;
// }

// }









import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { EstimateService } from '../../../services/Estimate/estimate-service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DialogContentComponent, DialogData } from '../../dialog-content-component/dialog-content-component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatDatepicker } from '@angular/material/datepicker';
 
export interface estimateModel{
id: number;
payment_Status: string
}
@Component({
  selector: 'app-view-estimate',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './view-estimate.html',
  styleUrl: './view-estimate.scss',

})
export class ViewEstimate implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('filterPopover') filterPopover!: MatDatepicker<any>;
  estimates: any[] = [];
  estimate:estimateModel[] =[];
  activeTab: string = 'all';
  showSearchBar: boolean = false;
  filteredSearchEstimates: any[] = [];
  searchTerm: string = '';
  filteredDateEstimates:any[] = [];
  dateRange: { start: Date | null; end: Date | null } = { start: null, end: null };



  private estimateService = inject(EstimateService);
 private dialog = inject(MatDialog);
  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {}

  // ngOnInit(): void {
  //   this.estimateService.getAllEstimates().subscribe({
  //     next: (data =>{ this.estimates = data; this.filteredDateEstimates = [...this.estimates];});
  //     error: (err) => console.error('Error fetching estimates:', err)
  //   }
  // }
  ngOnInit(): void {
  this.loadEstimates();
}

private loadEstimates(): void {
  this.estimateService.getAllEstimates().subscribe({
    next: (data) => {
      this.estimates = data;
     // this.filteredDateEstimates = [...this.estimates]; // initial copy
      //this.filterTable(); // apply current filters (tab, search, date)
    },
    error: (err) => {
      console.error('Error fetching estimates:', err);
      this.toastr.error('Failed to load estimates', 'Error');
    }
  });
}

  // normalizeStatus(payment_Status: string | null | undefined): string {
  //   console.log(payment_Status);
  //   return (payment_Status?.toUpperCase().trim() || '').toUpperCase();
    
  // }

  normalizeStatus(payment_Status: string | null | undefined): string {
  if (!payment_Status) return 'PENDING'; // fallback

  const normalized = payment_Status.trim().toUpperCase();

  // Map DB value → UI text
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

  // markAsPaid(estimate:estimateModel) {

  //    this.estimateService.markPaid({
  //   Id: estimate.id ?? 0,
  //   payment_Status: (estimate?.payment_Status)
  //   }).subscribe({
  //     next: (res) => {
  //       console.log(res.message);
  //       estimate.payment_Status = "payment done";
  //      this.toastr.success('Succesfully marked paid', 'Success',
  //  {
  //    timeOut: 3000
  //  }
  // );
  //  setTimeout(() => {
  //           window.location.reload();
  //         }, 2000); 
  //     },
  //     error: (err) => {
  //       console.error(' failed', err);
  //       this.toastr.error('Failed to mark paid', 'Error', {
  //           timeOut: 3000
  //         });
  //     },
  //   });
  // }
  applyDateFilter(): void {
  this.filterTable();
}
clearDateFilter(): void {
    this.dateRange = { start: null, end: null };
    this.filterTable();
  }
  filterTable(): void {
  let list = [...this.estimates];
  if (this.dateRange.start && this.dateRange.end) {
    const start = this.dateRange.start;
    const end = this.dateRange.end;

    list = list.filter(e => {
      if (!e.invoiceDate) return false;
      const invoiceDate = new Date(e.invoiceDate);
      return invoiceDate >= start && invoiceDate <= end;
    });
  }

  // Final result
  this.filteredDateEstimates = list;
}

  confirmBox(estimate:estimateModel) {
     const dialogRef: MatDialogRef<DialogContentComponent, boolean> = this.dialog.open(DialogContentComponent, {
    //const dialogRef = this.dialog.open(DialogContentComponent,{
      width: '400px',
      data: {
        title: 'Are you sure?',
        message: 'Confirm to mark as - "PAID"',
        confirmText: 'YES',
        cancelText: 'NO'
      }  as DialogData
    });

   
  //   dialogRef.afterClosed().subscribe((confirmed: boolean) => {
  //   if (confirmed && this.estimate) {
  //     this.markAsPaid(this.estimate); // Now this.estimate is SINGLE object
  //   } else {
  //     console.log('Mark as Paid cancelled');
  //   }
  // });
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

  
    //console.log('Estimate marked as PAID');

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

  search() {
    if (!this.searchTerm.trim()) {
      this.filteredSearchEstimates = this.estimates;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredSearchEstimates = this.estimates.filter(est => {
      return (
        (est.id?.toString().includes(term)) ||
        (est.client_Name?.toLowerCase().includes(term)) ||
        (est.estimate_Amount?.toString().includes(term)) ||
        (est.member_Name?.toString().includes(term)) ||
        (est.invoiceDate?.toString().includes(term)) ||
        (est.payment_Status?.toString().includes(term))
      );
    });
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

    return result;
  }
}