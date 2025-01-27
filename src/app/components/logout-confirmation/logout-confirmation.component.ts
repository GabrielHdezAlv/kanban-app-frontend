import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-logout-confirmation',
  template: `
    <div class="logout-dialog">
      <h2>¿Cerrar sesión?</h2>
      <p>¿Seguro que deseas salir de tu cuenta?</p>
      <div class="dialog-actions">
        <button mat-button (click)="close(false)">Cancelar</button>
        <button mat-raised-button color="warn" (click)="close(true)">Cerrar sesión</button>
      </div>
    </div>
  `,
  styles: [
    `
      .logout-dialog {
        text-align: center;
        padding: 20px;
      }
      .dialog-actions {
        display: flex;
        justify-content: space-around;
        margin-top: 20px;
      }
    `
  ],
  standalone: true,
  imports: [CommonModule, MatButtonModule]
})
export class LogoutConfirmationComponent {
  constructor(private dialogRef: MatDialogRef<LogoutConfirmationComponent>) {}

  close(result: boolean) {
    this.dialogRef.close(result); // Devuelve true si el usuario confirma el logout
  }
}
