import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {CdkDragDrop, CdkDragEnter, CdkDragMove, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { FormElement } from '../../models/form-element.model';
import {FormStoreService} from '../../services/form-state.service';


interface DropGuide {
  top: number;
  isActive: boolean;
}

@Component({
  selector: 'app-form-canvas',
  template: `
    <div class="canvas-container">
      <div class="form-preview">
        <div class="form-fields-container"
             cdkDropList
             #formCanvasList="cdkDropList"
             id="form-canvas-list"
             [cdkDropListData]="formStore.fields$ | async"
             [cdkDropListConnectedTo]="['toolboxList']"
             (cdkDropListDropped)="onDrop($event)">

          <!-- Mensaje cuando no hay campos -->
          <div *ngIf="(formStore.fields$ | async)?.length === 0" class="empty-state">
            <p>Arrastra elementos aquí para comenzar</p>
          </div>

          <div *ngFor="let field of formStore.fields$ | async"
               class="field-wrapper"
               [class.selected]="(formStore.selectedField$ | async)?.id === field.id"
               (click)="selectField(field, $event)"
               cdkDrag
               [cdkDragData]="field">

            <!-- Barra de herramientas -->
            <div class="field-toolbar" *ngIf="(formStore.selectedField$ | async)?.id === field.id">
              <div class="toolbar-group">
                <button mat-icon-button matTooltip="Reordenar" cdkDragHandle>
                  <mat-icon>drag_indicator</mat-icon>
                </button>
                <button mat-icon-button matTooltip="Ajustes"
                        (click)="openSettings(field, $event)">
                  <mat-icon>settings</mat-icon>
                </button>
                <button mat-icon-button matTooltip="Duplicar"
                        (click)="duplicateField(field, $event)">
                  <mat-icon>content_copy</mat-icon>
                </button>
                <button mat-icon-button matTooltip="Eliminar"
                        (click)="removeField(field, $event)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
              <button mat-icon-button
                      matTooltip="Cerrar"
                      (click)="closeToolbar($event)"
                      class="close-button">
                <mat-icon>close</mat-icon>
              </button>
            </div>

    <!-- Contenido del campo -->
            <div class="field-content" [ngSwitch]="field.type">
              <!-- Campo de texto -->
              <div *ngSwitchCase="'text'" class="form-field">
                <label class="field-label">{{field.label}}</label>
                <input type="text" [placeholder]="field.placeholder || ''" class="field-input">
              </div>

              <!-- Campo de email -->
              <div *ngSwitchCase="'email'" class="form-field">
                <label class="field-label">{{field.label}}</label>
                <input type="email" [placeholder]="field.placeholder || ''" class="field-input">
              </div>

              <!-- Campo de texto largo -->
              <div *ngSwitchCase="'textarea'" class="form-field">
                <label class="field-label">{{field.label}}</label>
                <textarea [placeholder]="field.placeholder || ''" class="field-textarea"></textarea>
              </div>
              <!-- Lista desplegable -->
              <div *ngSwitchCase="'select'" class="form-field">
                <label class="field-label">{{field.label}}</label>
                <select class="field-select" [multiple]="field.multiple">
                  <option value="" disabled selected>{{field.placeholder}}</option>
                  <option *ngFor="let option of field.options" [value]="option">
                    {{option}}
                  </option>
                </select>
              </div>

              <!-- Casillas de verificación -->
              <div *ngSwitchCase="'checkbox'" class="form-field">
                <label class="field-label">{{field.label}}</label>
                <div class="options-container" [class.horizontal]="field.layout === 'horizontal'">
                  <div class="checkbox-option" *ngFor="let option of field.options">
                    <label class="checkbox-label">
                      <input type="checkbox" [value]="option">
                      <span>{{option}}</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Botones de radio -->
              <div *ngSwitchCase="'radio'" class="form-field">
                <label class="field-label">{{field.label}}</label>
                <div class="options-container" [class.horizontal]="field.layout === 'horizontal'">
                  <div class="radio-option" *ngFor="let option of field.options">
                    <label class="radio-label">
                      <input type="radio" [name]="field.id" [value]="option">
                      <span>{{option}}</span>
                    </label>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .canvas-container {
      height: 100%;
      padding: 20px;
      background-color: #f5f5f5;
      overflow-y: auto;
    }

    .form-preview {
      background: white;
      border-radius: 8px;
      padding: 24px;
      min-height: 500px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-fields-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-height: 200px;
    }

    .field-wrapper {
      position: relative;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      background: white;
      transition: all 0.2s ease;
    }

    .field-wrapper:hover {
      border-color: #2196f3;
    }

    .field-wrapper.selected {
      border: 2px solid #2196f3;
    }

    .field-toolbar {
      position: absolute;
      top: -40px;
      left: 0;
      right: 0;
      height: 40px;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 4px 4px 0 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 8px;
      box-shadow: 0 -2px 4px rgba(0,0,0,0.05);
      z-index: 10;
    }

    .toolbar-group {
      display: flex;
      gap: 4px;
    }

    .field-content {
      padding: 16px;
    }

    .field-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 8px;
      color: #2c3e50;
    }

    .field-input, .field-textarea {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-size: 14px;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      border: 2px dashed #ccc;
      border-radius: 4px;
      color: #666;
    }

    .cdk-drag-preview {
      box-sizing: border-box;
      border-radius: 4px;
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
      0 8px 10px 1px rgba(0, 0, 0, 0.14),
      0 3px 14px 2px rgba(0, 0, 0, 0.12);
    }

    .cdk-drag-placeholder {
      opacity: 0.3;
    }

    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .field-textarea {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-size: 14px;
      resize: vertical;
    }

    .field-select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-size: 14px;
      background-color: white;
    }

    .options-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .options-container.horizontal {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 16px;
    }

    .checkbox-option, .radio-option {
      display: flex;
      align-items: center;
    }

    .checkbox-label, .radio-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    input[type="checkbox"], input[type="radio"] {
      cursor: pointer;
    }
  `],
  standalone: false
})
export class FormCanvasComponent {
  constructor(public formStore: FormStoreService) {}

  onDrop(event: CdkDragDrop<FormElement[] | null>) {
    if (!event.container.data) return;

    if (event.previousContainer === event.container) {
      const fields = [...event.container.data];
      const [removed] = fields.splice(event.previousIndex, 1);
      fields.splice(event.currentIndex, 0, removed);
      this.formStore.reorderFields(fields);
    } else {
      const fieldData = event.item.data as FormElement;
      const newField: FormElement = {
        ...fieldData,
        id: `field-${Date.now()}`
      };

      // Si no hay campos, inicializamos el array
      const currentFields = event.container.data || [];
      const updatedFields = [...currentFields];
      updatedFields.splice(event.currentIndex, 0, newField);

      this.formStore.reorderFields(updatedFields);
    }
  }

  selectField(field: FormElement, event: Event) {
    event.stopPropagation();
    this.formStore.selectField(field.id);
  }

  openSettings(field: FormElement, event: Event) {
    event.stopPropagation();
    this.formStore.selectField(field.id);
  }

  duplicateField(field: FormElement, event: Event) {
    event.stopPropagation();
    const newField = {
      ...field,
      id: `field-${Date.now()}`
    };
    this.formStore.addField(newField);
  }

  removeField(field: FormElement, event: Event) {
    event.stopPropagation();
    this.formStore.removeField(field.id);
    // Si el campo eliminado era el seleccionado, deseleccionamos
    if ((this.formStore.selectedField$.getValue()?.id === field.id)) {
      this.formStore.selectField(null);
    }
  }

  closeToolbar(event: Event) {
    event.stopPropagation();
    this.formStore.selectField(null);
  }
}
