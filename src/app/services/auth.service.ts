import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../components/custom-snackbar/custom-snackbar.component';
import { environmentProd } from '../../environments/environment.prod';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environmentProd.apiUrl}/api/auth`; // ✅ URL base desde configuración

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) { }

  /**
   * Registro de usuario
   */
  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { name, email, password });
  }

  /**
   * Inicio de sesión
   */
  login(email: string, password: string): Observable<any> {
    console.log("environment.apiUrl: ", environmentProd.apiUrl);

    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  /**
   * Mostrar mensajes con Snackbar
   */
  showMessage(message: string, type: 'success' | 'error' | 'info') {
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      duration: 3000,
      data: { message, type },
      panelClass: [`snackbar-${type}`],
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }
}
