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
      <h2 class="dialog-title">Confirmación</h2>
      <p class="dialog-message">{{ data.message }}</p>
      <div class="dialog-actions">
        <button mat-button class="accept-button" (click)="close()">Aceptar</button>
      </div>
    </div>
  `,
  styles: [
    `
      .dialog-container {
        text-align: center;
        padding: 24px;
        border-radius: 12px;
        background: #fff;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
      }
      .dialog-title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 12px;
        color: #333;
      }
      .dialog-message {
        font-size: 16px;
        color: #555;
        margin-bottom: 20px;
      }
      .dialog-actions {
        display: flex;
        justify-content: center;
      }
      .accept-button {
        background: #007bff;
        color: white;
        padding: 8px 16px;
        border-radius: 6px;
        transition: background 0.3s ease-in-out, transform 0.2s;
      }
      .accept-button:hover {
        background: #0056b3;
        transform: scale(1.05);
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
