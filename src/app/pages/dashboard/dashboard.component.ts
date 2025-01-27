import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { LogoutConfirmationComponent } from '../../components/logout-confirmation/logout-confirmation.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { TaskService } from '../../services/task.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule, MatButtonModule, MatIconModule, FormsModule],
  animations: [
    trigger('fadeAnimation', [
      state('hidden', style({ opacity: 0, transform: 'translateY(-20px)' })),
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('hidden => visible', [
        animate('800ms ease-out') // ⬅️ Fade-In al cargar
      ]),
      transition('visible => hidden', [
        animate('600ms ease-in') // ⬅️ Fade-Out al cerrar sesión
      ])
    ]),
    trigger('toggleGroups', [
      state('expanded', style({ width: '250px' })), // Estado expandido
      state('collapsed', style({ width: '50px' })), // Estado comprimido
      transition('expanded <=> collapsed', animate('300ms ease-in-out')) // Animación de transición
    ])
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  @Output() groupSelected = new EventEmitter<string>();
  
  isExpanded = false;
  selectedGroup: TaskGroup | null = null;
  tasksByColumn: { [key: number]: any[] } = {}; // 👈 Almacena tareas por estado

  addingTaskColumn: number | null = null; // Estado para saber en qué columna se está añadiendo una tarea
  newTaskName: string = ''; // Almacena el nombre de la nueva tarea  

  private toggleListener!: (event: Event) => void;
  private userId = localStorage.getItem('userId') || '';

  state = 'hidden'; // Inicialmente el Dashboard está oculto

  constructor(
    private router: Router, 
    private dialog: MatDialog,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.state = 'visible'; // 👈 Activar Fade-In después de cargar el componente
    }, 100);

    // Escuchar el evento global cuando cambia el estado
    this.toggleListener = (event: Event) => {
      this.isExpanded = (event as CustomEvent).detail;
    };
    window.addEventListener('toggleGroups', this.toggleListener);
  }

  ngOnDestroy() {
    // Remover el listener cuando se destruye el componente
    window.removeEventListener('toggleGroups', this.toggleListener);
  }

  logout() {
    const dialogRef = this.dialog.open(LogoutConfirmationComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.state = 'hidden'; // 👈 Activar Fade-Out al cerrar sesión

        setTimeout(() => {
          localStorage.removeItem('token'); // Elimina el token
          this.router.navigate(['/login']); // Redirige al login después de la animación
        }, 600); // ⏳ Espera a que termine la animación antes de redirigir
      }
    });
  }

  onGroupSelected(group: any) {
    this.selectedGroup = group;
    this.fetchTasks(group.groupId);
    
    // ✅ Emitimos un evento global con el nombre del grupo seleccionado
    window.dispatchEvent(new CustomEvent('groupSelected', { detail: group.name }));
  }

  fetchTasks(groupId: string) {
    if (!this.userId) {
      console.error('⚠️ No se encontró userId en localStorage.');
      return;
    }

    this.taskService.getTasksByGroups(this.userId, groupId).subscribe(
      tasks => {
        // ✅ Agrupar tareas por estado
        this.tasksByColumn = tasks.reduce((acc, task) => {
          acc[task.state] = acc[task.state] || [];
          acc[task.state].push(task);
          return acc;
        }, {} as { [key: number]: any[] });
      },
      error => {
        console.error('❌ Error al obtener tareas:', error);
      }
    );
  }

  startAddingTask(columnStatus: number) {
    this.addingTaskColumn = columnStatus;
    this.newTaskName = ''; // Reiniciar el campo de entrada
  }

  cancelAddingTask() {
    this.addingTaskColumn = null;
    this.newTaskName = '';
  }

  addTask(columnStatus: number) {
    if (!this.newTaskName.trim()) return;

    const newTask: NewTask = {
      name: this.newTaskName,
      description: '',
      state: columnStatus,
      creator: "Gabriel",
      createdAt: new Date()
    };

    // Agregar tarea localmente
    if (!this.tasksByColumn[columnStatus]) {
      this.tasksByColumn[columnStatus] = [];
    }
    this.tasksByColumn[columnStatus].push(newTask);

    // 🚀 Enviar la tarea al backend si lo deseas
    // this.taskService.addTask(newTask).subscribe(() => console.log("Tarea agregada con éxito"));

    this.cancelAddingTask(); // Resetear la vista después de añadir la tarea
  }
}

interface TaskColumn {
  columnName: string;
  status: number;
}

interface TaskGroup {
  groupId: string;
  name: string;
  columns: TaskColumn[];
}

interface NewTask {
  name: string,
  description: string,
  state: number,
  creator: "Gabriel",
  createdAt: Date
}