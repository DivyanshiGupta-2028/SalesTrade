import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { DashboardService } from '../../../services/Dashboard/dashboard-service';

@Component({
  selector: 'app-dashboard',
    standalone: true,
   imports: [CommonModule, FontAwesomeModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit{
  selectedMonth = 'July';
  faArrowDown = faArrowDown;
   dashboardExpenses: any[] = [];
   recordPayments: any[] = [];

  private dashboardService = inject(DashboardService); 

  ngOnInit(): void {
    this.dashboardService.getAllExpenses().subscribe({
      next: (data) => this.dashboardExpenses = data,
      error: (err) => console.error('Error fetching dashboardexpenses:', err)
    });

    this.dashboardService.getAllRecordPayments().subscribe({
      next: (data) => this.recordPayments = data,
      error: (err) => console.error('Error fetching record payments:', err)
    });
  }
}
