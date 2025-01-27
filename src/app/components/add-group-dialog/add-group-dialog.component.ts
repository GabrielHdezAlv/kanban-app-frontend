import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-group-dialog',
  templateUrl: './add-group-dialog.component.html',
  styleUrls: ['./add-group-dialog.component.scss'],
  standalone: true,
  imports: [MatIconModule, MatFormFieldModule, MatInputModule, CommonModule, ReactiveFormsModule]
})
export class AddGroupDialogComponent {
  groupForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddGroupDialogComponent>,
    private fb: FormBuilder
  ) {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      columns: this.fb.array([this.createColumn()]) // Array inicial con 1 columna
    });
  }
  
  get columns(): FormArray {
    return this.groupForm.get('columns') as FormArray;
  }

  createColumn(): FormGroup {
    return this.fb.group({
      columnName: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  addColumn() {
    if (this.columns.length < 10) {
      this.columns.push(this.createColumn());
    }
  }

  removeColumn(index: number) {
    this.columns.removeAt(index);
  }

  save() {
    if (this.groupForm.valid) {
      const formValue = this.groupForm.value;
  
      // Agregamos el estado a cada columna de forma secuencial
      const columnsWithState = formValue.columns.map((column: any, index: number) => ({
        columnName: column.columnName,
        state: index // Asignamos el índice como estado
      }));
  
      // Cerramos el diálogo devolviendo los datos transformados
      this.dialogRef.close({
        name: formValue.name,
        columns: columnsWithState
      });
    }
  }
  

  cancel() {
    this.dialogRef.close(null); // Cierra sin guardar
  }
}
