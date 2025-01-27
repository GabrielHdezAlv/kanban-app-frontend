import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatToolbarModule, CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'todo-app';
  isDashboard = false;
  selectedGroupName = ''; // Nombre del grupo seleccionado por defecto
  dashboardBgColor ='rgb(42, 84, 150)'; // Color inicial para coincidir con el dashboard

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isDashboard = event.url.includes('/dashboard');
    });

    // ✅ Escuchamos el evento global y actualizamos `selectedGroupName`
    window.addEventListener('groupSelected', (event: any) => {
      this.selectedGroupName = event.detail;
    });
  }
}
