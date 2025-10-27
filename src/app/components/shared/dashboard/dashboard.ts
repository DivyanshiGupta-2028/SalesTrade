import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { DashboardService } from '../../../services/Dashboard/dashboard-service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
    standalone: true,
   imports: [CommonModule, FontAwesomeModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit{
  selectedMonth = 'October';
  selectedYear = '2025'
  faArrowDown = faArrowDown;
   dashboardExpenses: any[] = [];
   recordPayments: any[] = [];
   total_Amount: number | null = null;
  error: string | null = null;
total_Expenses: number | null = null; // Renamed for clarity
  total_Credits: number | null = null;
  private dashboardService = inject(DashboardService); 

  ngOnInit(): void {
    this.fetchData();
    this.dashboardService.getAllExpenses().subscribe({
      next: (data) => this.dashboardExpenses = data,
      error: (err) => console.error('Error fetching dashboardexpenses:', err)
    });

    this.dashboardService.getAllRecordPayments().subscribe({
      next: (data) => this.recordPayments = data,
      error: (err) => console.error('Error fetching record payments:', err)
    });
  }
fetchData(): void {
  if (!this.selectedMonth || !this.selectedYear) {
    this.total_Expenses = null;
    this.total_Credits = null;
    this.dashboardExpenses = [];
    this.recordPayments = [];
    this.error = 'Please select both month and year';
    console.log('Validation failed:', this.error);
    return;
  }

  const yearNum = parseInt(this.selectedYear);
  if (isNaN(yearNum)) {
    this.total_Expenses = null;
    this.total_Credits = null;
    this.dashboardExpenses = [];
    this.recordPayments = [];
    this.error = 'Invalid year';
    console.log('Invalid year:', this.selectedYear);
    return;
  }

  forkJoin({
    expenses: this.dashboardService.getFilteredExpenses(this.selectedMonth, yearNum),
    credits: this.dashboardService.getFilteredRecordPayments(this.selectedMonth, yearNum)
  }).subscribe({
    next: ({ expenses, credits }) => {
      // console.log('Raw Expenses Response:', JSON.stringify(expenses, null, 2));
      // console.log('Raw Credits Response:', JSON.stringify(credits, null, 2));

      // Handle expenses response
      if (Array.isArray(expenses) && expenses.length > 0) {
        this.total_Expenses = expenses[0].total_Amount !== undefined ? expenses[0].total_Amount : null;
        this.dashboardExpenses = expenses; // Assign the array for the table
      } else {
        this.total_Expenses = null;
        this.dashboardExpenses = [];
        this.error = 'No expenses data available';
      }

      // Handle credits response
      if (Array.isArray(credits) && credits.length > 0) {
        this.total_Credits = credits[0].total_Amount !== undefined ? credits[0].total_Amount : null;
        this.recordPayments = credits; // Assign the array for the table
      } else {
        this.total_Credits = null;
        this.recordPayments = [];
        this.error = this.error ? `${this.error}; No credits data available` : 'No credits data available';
      }

    //  console.log('Assigned Total Expenses:', this.total_Expenses, 'Assigned Total Credits:', this.total_Credits);
    },
    error: (err) => {
      this.total_Expenses = null;
      this.total_Credits = null;
      this.dashboardExpenses = [];
      this.recordPayments = [];
      this.error = 'Error fetching data';
      console.error('API Error:', err);
    }
  });
}
}

