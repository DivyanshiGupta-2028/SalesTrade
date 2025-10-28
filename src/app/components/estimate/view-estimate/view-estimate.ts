import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { EstimateService } from '../../../services/Estimate/estimate-service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-view-estimate',
 standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-estimate.html',
  styleUrl: './view-estimate.scss',
   providers: []
})
export class ViewEstimate implements OnInit {
   @ViewChild('searchInput') searchInput!: ElementRef;
  estimates: any[] = [];
  activeTab: string = 'all';
  showSearchBar: boolean = false;
  filteredSearchEstimates: any[] = []; 
  searchTerm: string = '';

  private estimateService = inject(EstimateService);
constructor(private router:Router,   private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.estimateService.getAllEstimates().subscribe({
      next: (data) => this.estimates = data,
      error: (err) => console.error('Error fetching estimates:', err)
    });
  }

  normalizeStatus(status: string | null | undefined): string {
  return (status?.toUpperCase().trim() || '').toUpperCase();
}
  switchTab(tab: string): void {
    this.activeTab = tab;
  }
//   toggleSearch() {
//   this.showSearchBar = !this.showSearchBar;
//   if (this.showSearchBar) {
//     setTimeout(() => this.searchInput.nativeElement.focus(), 0);
//   } 
// }
  trackById(index: number, estimate: any): any {
    return estimate.id;
  }
exportPdf(estimate: any): void {
    // Force change detection
    this.cdr.detectChanges();

    // Wait for DOM to update
    setTimeout(() => {
      const id = `estimate-row-${estimate.id}`;
      const element = document.getElementById(id);

       console.log('Looking for ID:', id);
       console.log('Found element:', element);

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
          pdf.save(`Estiimate${estimate.id}.pdf`);
        })
        .catch(err => {
          console.error('PDF Error:', err);
          alert('Failed to generate PDF');
        });
    }, 200); 
  }

  edit(record: any): void {
    this.router.navigate(['/estimates/edit', record.id]);
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
      // Wait for DOM to render input
      setTimeout(() => {
        if (this.searchInput?.nativeElement) {
          this.searchInput.nativeElement.focus();
        }
      }, 100); // 100ms safe delay
    } else {
      this.searchTerm = '';
    }
  }
// else {
//     this.clearSearch();
//   }
 search() {
    if (!this.searchTerm.trim()) {
      this.filteredSearchEstimates = this.estimates;
      return;
    }

    const term = this.searchTerm.toLowerCase();

    this.filteredSearchEstimates = this.estimates.filter(est => {
      return (
        (est.id?.includes(term)) ||
        (est.client_Name?.toLowerCase().includes(term)) ||
        (est.estimate_Amount?.toString().includes(term)) ||
        (est.member_Name?.toString().includes(term)) ||
        (est.invoiceDate?.toString().includes(term)) ||
        (est.payment_Status?.toString().includes(term)) 
      );
    });
  }
//  get filteredEstimates(): any[] {
//   if (this.activeTab === 'all') return this.estimates;
//   if (this.activeTab === 'due') {
//     return this.estimates.filter(e => e.payment_Status?.toLowerCase() === 'pending');
//   }
//   if (this.activeTab === 'paid') {
//     return this.estimates.filter(e => e.payment_Status?.toLowerCase() === 'payment done');
//   }
//   return this.estimates;
// }


get filteredEstimates(): any[] {
  let result = this.estimates;

  // 1. Apply Tab Filter
  if (this.activeTab === 'due') {
    result = result.filter(e => this.normalizeStatus(e.payment_Status) === 'PENDING');
  } else if (this.activeTab === 'paid') {
    result = result.filter(e => this.normalizeStatus(e.payment_Status) === 'PAYMENT DONE');
  }
  // 'all' → no filter

  // 2. Apply Search Filter
  if (this.searchTerm.trim()) {
    const term = this.searchTerm.toLowerCase().trim();
    result = result.filter(e => {
      return (
        (e.id?.toString().toLowerCase().includes(term)) ||
        (e.client_Name?.toLowerCase().includes(term)) ||
        (e.estimate_Amount?.toString().includes(term)) ||
        (e.member_Name?.toLowerCase().includes(term)) ||
        (e.invoiceDate?.toString().toLowerCase().includes(term))||
        (e.payment_Status?.toString().includes(term))
      );
    });
  }

  return result;
}

}
