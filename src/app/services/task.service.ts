import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5285/api'; // Cambia esto si tu API tiene otra URL base
  private apiUrlGroups = 'http://localhost:5285/api/tasks/api/groups';
  private apiUrlTasks = 'http://localhost:5285/api/tasks/api/groups/tasks';
  private apiUrlNewGroup = 'http://localhost:5285/api/tasks/api/addNewGroup';
  private apiUrlNewTask = 'http://localhost:5285/api/tasks/api/newTasks';

  constructor(private http: HttpClient) {}

  // Obtener grupos de tareas
  getTaskGroups(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetTasksGroups`);
  }

  // Agregar un nuevo grupo de tareas
  addTaskGroup(name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddGroup`, { name });
  }

  getUserGroups(userId: string): Observable<TaskGroup[]> {
    return this.http.get<TaskGroup[]>(`${this.apiUrlGroups}?userId=${userId}`);
  }

  getTasksByGroups(userId: string, groupId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrlTasks}?userId=${userId}&groupId=${groupId}`);
  }  

  // Añadir un nuevo grupo
  addNewGroup(userId: string, newGroup: any) {
    return this.http.post(`${this.apiUrlNewGroup}?userId=${userId}`, newGroup);
  }

  addNewTask(userId: string, groupId: string, newTask: any) {
    return this.http.post(`${this.apiUrlNewTask}?userId=${userId}?groupId=${groupId}`, newTask); 
  }
}

interface TaskGroup {
  groupId: string;
  name: string;
  columns: TaskColumn[]; // Ahora incluimos las columnas dentro de cada grupo
}

interface TaskColumn {
  columnName: string;
  status: number;
}

interface NewTaskGroup {
  name: string;
  columns: TaskColumn[];
}

interface Task {
    id: string,
    name: string,
    description: string,
    state: number,
    creator: string
}