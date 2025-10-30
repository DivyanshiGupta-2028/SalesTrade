import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ExpensesService } from '../../../services/Expenses/expenses-service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AddExpenses } from '../add-expenses/add-expenses';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-view-expenses',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './view-expenses.html',
  styleUrl: './view-expenses.scss'
})
export class ViewExpenses implements OnInit {
  showAlert = false;
   alertMessage = 'This is a custom alert message!';
  alertLicenseId?: number;
  alertTitle = 'Renew License';
  expenses: any[] = [];
  filteredExpenses: any[] = []; 
  searchTerm: string = '';
activeTab: string = 'all';
  private expensesService = inject(ExpensesService); 
constructor(private router:Router,  private dialog: MatDialog, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.expensesService.getAllExpenses().subscribe({
      // next: (data) => this.expenses = data,
      next: (data) => {
        this.expenses = data;
        this.filteredExpenses = data; 
      },
      error: (err) => console.error('Error fetching expenses:', err)
    });
  }
switchTab(tab: string): void {
    this.activeTab = tab;
    this.applyFilters();
  }
  search() {
    this.applyFilters();
    if (!this.searchTerm.trim()) {
      this.filteredExpenses = [...this.expenses];
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();

    this.filteredExpenses = this.expenses.filter(expense => {
      return (
        (expense.date?.toLowerCase().includes(term)) ||
        (expense.vendor_Name?.toLowerCase().includes(term)) ||
        (expense.amount?.toString().includes(term)) ||
        (expense.bill_Amount?.toString().includes(term)) ||
        (expense.tds?.toString().includes(term)) ||
        (expense.payment_Purpose?.toLowerCase().includes(term)) ||
        (expense.added_By?.toLowerCase().includes(term)) ||
        (expense.categoryTitle?.toLowerCase().includes(term))
      );
    });
  }

  trackById(index: number, expense: any): any {
    return expense.id;
  }
exportPdf(expense: any): void {
    // Force change detection
    this.cdr.detectChanges();

    // Wait for DOM to update
    setTimeout(() => {
      const id = `expense-row-${expense.id}`;
      const element = document.getElementById(id);

       console.log('Looking for ID:', id);
       console.log('Found element:', element);

      if (!element) {
        alert('Expense row not in DOM. Please scroll to it and try again.');
        return;
      }

      html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#fff' })
        .then(canvas => {
          const imgWidth = 190;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          const pdf = new jsPDF('p', 'mm', 'a4');
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, imgWidth, imgHeight);
          pdf.save(`Expense${expense.id}.pdf`);
        })
        .catch(err => {
          console.error('PDF Error:', err);
          alert('Failed to generate PDF');
        });
    }, 200); 
  }

  edit(expense: any): void {
    this.router.navigate(['/expenses/edit', expense.id]);
  }

  delete(expense: any): void {
    if (!confirm(`Delete invoice #${expense.id}?`)) return;

    this.expensesService.deleteExpenses(expense.id).subscribe({
      next: () => {
        this.expenses = this.expenses.filter(i => i.id !== expense.id);
        this.filteredExpenses = this.filteredExpenses.filter(i => i.id !== expense.id);
      },
      error: err => alert('Delete failed')
    });
  }

  private applyFilters() {
    let result = this.expenses;

    if (this.activeTab === 'gst') {
      result = result.filter(e => e.isGstClaimable === true); 
    }

    if (this.searchTerm?.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(e => {
        return (
          e.date?.toString().toLowerCase().includes(term) ||
          e.vendor_Name?.toLowerCase().includes(term) ||
          e.amount?.toString().includes(term) ||
          e.bill_Amount?.toString().includes(term) ||
          e.tds?.toString().includes(term) ||
          e.payment_Purpose?.toLowerCase().includes(term) ||
          e.added_By?.toLowerCase().includes(term) ||
          e.categoryTitle?.toLowerCase().includes(term)
        );
      });
    }

    this.filteredExpenses = result;
  }
openAddExpenseDialog(): void {
  this.dialog.open(AddExpenses, {
    width: '500px',
    maxWidth: '100vw',
    panelClass: 'modern-dialog',
    data: { /* pass data if needed */ }
  });
}
}
