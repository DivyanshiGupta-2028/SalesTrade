import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { DashboardService } from '../../../services/Dashboard/dashboard-service';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Router, RouterModule } from '@angular/router';

  interface DashboardEntry {
  year: number;
  monthName: string;
  monthNumber: number;
  companiesAdded: number;
}
@Component({
  selector: 'app-license-dashboard',
    standalone: true,
   imports: [CommonModule, FontAwesomeModule, FormsModule, BaseChartDirective, RouterModule],
  templateUrl: './license-dashboard.html',
  styleUrl: './license-dashboard.scss'
})
export class LicenseDashboard implements OnInit{
  faArrowDown = faArrowDown;
  dasboardCards: {
  totalCompanies: number,
  expiredLicenses: number,
  activeLicenses: number,
  upcomingRenewals: number,
  recentlyAdded: number
  } | null = null;


  showSidebar = false;

    public licenseChartData: ChartData<'doughnut'> = {
    labels: ['Active', 'Expired', 'Upcoming'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#3b82f6', '#ef4444', '#06b6d4'],
        hoverOffset: 10
      }
    ]
  };

  public licenseChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  private dashboardService = inject(DashboardService); 

months = ['Jan','Feb','March','April','May','June','July','August','September','October','November','December'];
  lineData: ChartData<'line'> = {
    labels: this.months,
    datasets: [
      {
        label: 'Companies Added',
        data: Array(12).fill(0),
        tension: 0.35,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2
      }
    ]
  };

  lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
      x: { grid: { display: false } }
    },
    plugins: {
      legend: { display: true, position: 'bottom' },
      tooltip: { mode: 'index', intersect: false }
    }
  };

   constructor(
    // private fb: FormBuilder,
    // private licenseService: LicenseService,
    // private masterService: MasterService,
    // public clientService: ClientService,
    private router: Router,

  ) { }

ngOnInit(): void {
    this.dashboardService.getAllDashboardCardEntries().subscribe({
      next: (data) => {
        this.dasboardCards = data.length > 0 ? data[0] : null;

        if (this.dasboardCards) {
          this.licenseChartData.datasets[0].data = [
            this.dasboardCards.activeLicenses,
            this.dasboardCards.expiredLicenses,
            this.dasboardCards.upcomingRenewals
          ];
          this.licenseChartData = { ...this.licenseChartData };
        }
      },
      error: (err: any) => console.error('Error fetching card details:', err)
    });


   this.dashboardService.getDashboardGraphCardEntries().subscribe({
  next: (rows: DashboardEntry[]) => {
    const series = Array(12).fill(0);

    rows.forEach(r => {
      series[r.monthNumber - 1] = r.companiesAdded;
    });

    this.lineData = {
      labels: this.months,
      datasets: [{
        ...this.lineData.datasets[0],
        data: series
      }]
    };
  },
  error: err => console.error('Monthly data error:', err)
});
  }
  


  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }


}
