import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { EstimateService } from '../../../services/Estimate/estimate-service';

@Component({
  selector: 'app-view-estimate',
 standalone: true,
  imports: [CommonModule],
  templateUrl: './view-estimate.html',
  styleUrl: './view-estimate.scss',
   providers: []
})
export class ViewEstimate implements OnInit {
  estimates: any[] = [];
  activeTab: string = 'all';

  private estimateService = inject(EstimateService);

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

 get filteredEstimates(): any[] {
  if (this.activeTab === 'all') return this.estimates;
  if (this.activeTab === 'due') {
    return this.estimates.filter(e => e.payment_Status?.toLowerCase() === 'pending');
  }
  if (this.activeTab === 'paid') {
    return this.estimates.filter(e => e.payment_Status?.toLowerCase() === 'payment done');
  }
  return this.estimates;
}

}
