import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TaskService } from '../../services/task.service';
import { AddGroupDialogComponent } from '../add-group-dialog/add-group-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

interface TaskGroup {
  groupId: string;
  name: string;
}

@Component({
  selector: 'app-task-groups',
  standalone: true,
  templateUrl: './task-groups.component.html',
  styleUrls: ['./task-groups.component.scss'],
  imports: [CommonModule, MatCardModule, MatButtonModule, MatSnackBarModule, MatIconModule]
})
export class TaskGroupsComponent implements OnInit {
  @Output() groupSelected = new EventEmitter<TaskGroup>();
  
  taskGroups: TaskGroup[] = [];
  selectedGroup: TaskGroup | null = null;

  hoveredGroup: string | null = null; // Para mostrar el botón al hacer hover
  openMenuGroup: string | null = null; // Para abrir el menú

  userId: any;

  constructor(
    private taskService: TaskService, 
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.getGroups();
  }

  getGroups(){
    if (this.userId) {
      this.taskService.getUserGroups(this.userId).subscribe(groups => {
        this.taskGroups = groups;

        if (this.taskGroups.length > 0) {
          this.selectGroup(this.taskGroups[0]);
        }
      });
    }
  }

  selectGroup(group: TaskGroup) {
    this.selectedGroup = group;
    this.groupSelected.emit(group); // Emitimos el grupo seleccionado al Dashboard
  }

  addNewGroup() {
    const dialogRef = this.dialog.open(AddGroupDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.addNewGroup(this.userId, result).subscribe(r => {
          this.getGroups();
        });
      }
    });
  }

  toggleMenu(event: Event, group: any) {
    event.stopPropagation(); // ⛔ Evita que el `click` seleccione el grupo
    this.openMenuGroup = this.openMenuGroup === group.groupId ? null : group.groupId;
  }

  deleteGroup(group: any) {
    console.log("Eliminar grupo:", group);
  }

  editGroup(group: any) {
    console.log("Editar grupo:", group);
  }

  // ✅ Escucha clics fuera del menú y lo cierra
  @HostListener('document:click', ['$event'])
  closeMenu(event: Event) {
    const targetElement = event.target as HTMLElement;

    // Si el click NO ocurrió dentro del grupo que tiene el menú abierto, lo cerramos
    if (!targetElement.closest('.group-options-menu') && !targetElement.closest('.group-options-btn')) {
      this.openMenuGroup = null;
    }
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
