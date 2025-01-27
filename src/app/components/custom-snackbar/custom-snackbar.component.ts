import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-custom-snackbar',
  template: `
    <div class="snackbar-container">
      <mat-icon class="snackbar-icon" *ngIf="data.type === 'success'">check_circle</mat-icon>
      <mat-icon class="snackbar-icon" *ngIf="data.type === 'error'">error</mat-icon>
      <mat-icon class="snackbar-icon" *ngIf="data.type === 'info'">info</mat-icon>
      <span class="snackbar-message">{{ data.message }}</span>
    </div>
  `,
  styles: [
    `
      .snackbar-container {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .snackbar-icon {
        font-size: 24px;
      }

      .snackbar-message {
        font-size: 16px;
        font-weight: bold;
      }
    `
  ],
  standalone: true,
  imports: [CommonModule, MatIconModule] // 👈 Se agrega MatIconModule
})
export class CustomSnackbarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    public snackBarRef: MatSnackBarRef<CustomSnackbarComponent>
  ) {}
}
