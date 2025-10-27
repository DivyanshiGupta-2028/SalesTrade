
import { Component, inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIf, NgFor } from '@angular/common'; // ✅ IMPORT THESE
import { ClientService } from '../../../services/Client/client-service';
import { AddClient } from '../../client/add-client/add-client';
import { Router } from '@angular/router';
import { SelectFormat } from '../../Invoice/select-format/select-format';

@Component({
  selector: 'app-create-estimate',
  standalone: true,
   imports: [
    MatDialogModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,      
    NgFor       
  ],
  templateUrl: './create-estimate.html',
  styleUrl: './create-estimate.scss'
})
export class CreateEstimate  implements OnInit {
  searchTerm = '';
  clients: any[] = [];
constructor(private dialogRef: MatDialogRef<CreateEstimate>, private dialog: MatDialog,  private router: Router ) {}
  private clientService = inject(ClientService);
  // private dialogRef = inject(MatDialogRef<CreateEstimate>);

  ngOnInit(): void {
    this.clientService.getAllClients().subscribe({
      next: (response) => {
        this.clients = response; 
      },
      error: (err) => {
        console.error('Failed to load clients', err);
      }
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
  openAddClientDialog() {
  this.dialog.open(AddClient, {
    width: '600px',
    disableClose: true,
    panelClass: 'custom-dialog-container' 
  });
}

selectClient(clientId: number) {
  this.dialogRef.close(); 

  this.router.navigate(['/add-estimate', clientId]);
}


}
