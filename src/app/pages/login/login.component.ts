import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    RouterModule,
    MatSnackBarModule // 👈 Para mostrar mensajes de éxito/error
  ]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // 👇 Depuración: Verifica el estado del formulario en la consola
    this.loginForm.valueChanges.subscribe(values => {
      console.log('Formulario actualizado:', values);
      console.log('Estado del formulario:', this.loginForm.status);
    });
  }

  login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
  
      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.authService.showMessage('Inicio de sesión exitoso', 'success');
  
          localStorage.setItem('token', response.token); // Guarda el token
          localStorage.setItem('userId', response.userId); // Guarda el userId
          this.router.navigate(['/dashboard']); // 👈 Redirige al dashboard
        },
        error: () => {
          this.authService.showMessage('Credenciales incorrectas', 'error');
        }
      });
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
