import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <div class="dialog-container">
      <h2>Confirmación</h2>
      <p>{{ data.message }}</p>
      <div class="dialog-actions">
        <button mat-button color="primary" (click)="close()">Aceptar</button>
      </div>
    </div>
  `,
  styles: [
    `
      .dialog-container {
        text-align: center;
        padding: 20px;
      }
      .dialog-actions {
        margin-top: 20px;
        display: flex;
        justify-content: center;
      }
    `,
  ],
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}