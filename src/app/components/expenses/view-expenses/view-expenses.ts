import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ExpensesService } from '../../../services/Expenses/expenses-service';

@Component({
  selector: 'app-view-expenses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-expenses.html',
  styleUrl: './view-expenses.scss'
})
export class ViewExpenses implements OnInit {
  expenses: any[] = [];

  private expensesService = inject(ExpensesService); 

  ngOnInit(): void {
    this.expensesService.getAllExpenses().subscribe({
      next: (data) => this.expenses = data,
      error: (err) => console.error('Error fetching expenses:', err)
    });
  }
}
