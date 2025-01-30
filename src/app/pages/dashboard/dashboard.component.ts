import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { LogoutConfirmationComponent } from '../../components/logout-confirmation/logout-confirmation.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { TaskGroupsComponent } from '../../components/task-groups/task-groups.component';
import { MatIconModule } from '@angular/material/icon';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    TaskGroupsComponent,
    MatButtonModule,
    MatIconModule
  ],
  animations: [
    trigger('fadeAnimation', [
      state('hidden', style({ opacity: 0, transform: 'translateY(-20px)' })),
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('hidden => visible', [
        animate('800ms ease-out')
      ]),
      transition('visible => hidden', [
        animate('600ms ease-in')
      ])
    ]),
    trigger('toggleGroups', [
      state('expanded', style({ width: '250px' })),
      state('collapsed', style({ width: '50px' })),
      transition('expanded <=> collapsed', animate('300ms ease-in-out'))
    ])
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  @Output() groupSelected = new EventEmitter<string>();

  isExpanded = false;
  selectedGroup: TaskGroup | null = null;
  tasksByColumn: { [key: number]: any[] } = {};

  private toggleListener!: (event: Event) => void;
  private userId = localStorage.getItem('userId') || '';

  state = 'hidden';

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private taskService: TaskService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.state = 'visible';
    }, 100);

    this.toggleListener = (event: Event) => {
      this.isExpanded = (event as CustomEvent).detail;
    };
    window.addEventListener('toggleGroups', this.toggleListener);
  }

  ngOnDestroy() {
    window.removeEventListener('toggleGroups', this.toggleListener);
  }

  logout() {
    const dialogRef = this.dialog.open(LogoutConfirmationComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.state = 'hidden';

        setTimeout(() => {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }, 600);
      }
    });
  }

  onGroupSelected(group: any) {
    this.selectedGroup = group;
    this.fetchTasks(group.groupId);

    window.dispatchEvent(new CustomEvent('groupSelected', { detail: group.name }));
  }

  fetchTasks(groupId: string) {
    if (!this.userId) {
      console.error('⚠️ No se encontró userId en localStorage.');
      return;
    }

    this.taskService.getTasksByGroups(this.userId, groupId).subscribe(
      tasks => {
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

  addNewTask(event: any) {
    console.log("event: ", event);
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
