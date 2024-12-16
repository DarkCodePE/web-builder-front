import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CdkDragDrop, CdkDragEnter, CdkDragMove, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { FormElement } from '../../models/form-element.model';


interface DropGuide {
  top: number;
  isActive: boolean;
}

@Component({
  selector: 'app-form-canvas',
  template: `
    <div class="canvas-outer-container" #canvasContainer>
      <div class="canvas-scroll-container">
        <div class="form-preview">
          <h2 class="form-title">Get a Price Quote</h2>

          <div class="form-fields-container"
               cdkDropList
               #dropList="cdkDropList"
               [cdkDropListData]="formFields"
               (cdkDropListDropped)="onDrop($event)">

            <div *ngFor="let field of formFields; let i = index"
                 class="field-wrapper"
                 [attr.data-index]="i"
                 cdkDrag
                 [cdkDragData]="field">

              <!-- Preview mientras se arrastra -->
              <div *cdkDragPreview class="drag-preview">
                <mat-icon>{{field.icon}}</mat-icon>
                <span>{{field.label}}</span>
              </div>

              <!-- Placeholder mientras se arrastra -->
              <div *cdkDragPlaceholder class="field-placeholder"></div>

              <!-- Contenido real del campo -->
              <div [ngSwitch]="field.type" class="field-content">
                <div *ngSwitchCase="'text'" class="form-field">
                  <label class="field-label">{{field.label}}</label>
                  <input type="text"
                         [placeholder]="field.placeholder || ''"
                         class="field-input">
                </div>
                <div *ngSwitchCase="'email'" class="form-field">
                  <label class="field-label">{{field.label}}</label>
                  <input type="email"
                         [placeholder]="field.placeholder || ''"
                         class="field-input">
                </div>
                <!-- Otros tipos de campos aquí -->
              </div>
            </div>

            <!-- Área vacía para drop cuando no hay campos -->
            <div *ngIf="formFields.length === 0"
                 class="empty-state">
              <mat-icon>add_circle_outline</mat-icon>
              <p>Arrastra elementos aquí para comenzar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .canvas-outer-container {
      height: 100%;
      position: relative;
      background-color: #f5f5f5;
      overflow: hidden;
    }

    .canvas-scroll-container {
      height: 100%;
      padding: 20px;
      overflow-y: auto;
      overflow-x: hidden;
      box-sizing: border-box;
    }

    .form-preview {
      background: white;
      border-radius: 8px;
      padding: 24px;
      min-height: 500px;
      max-width: 800px;
      margin: 0 auto;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-title {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 24px;
      color: #2c3e50;
      position: sticky;
      top: 0;
      background: white;
      padding: 16px 0;
      z-index: 10;
    }

    .form-fields-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-height: 200px;
    }

    .field-wrapper {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      transition: all 0.2s ease;
      position: relative;
      width: 100%;
      box-sizing: border-box;
    }

    .field-wrapper:hover {
      border-color: #2196f3;
      box-shadow: 0 2px 4px rgba(33, 150, 243, 0.1);
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

    .field-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }

    .drag-preview {
      padding: 12px;
      background: white;
      border-radius: 4px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 8px;
      max-width: 300px;
    }

    .field-placeholder {
      background: #f5f5f5;
      border: 2px dashed #ccc;
      border-radius: 4px;
      height: 60px;
      margin: 8px 0;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #666;
      border: 2px dashed #ccc;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .cdk-drop-list-dragging .field-wrapper:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `],
  standalone: false
})
export class FormCanvasComponent {
  @ViewChild('canvasContainer') canvasContainer!: ElementRef;
  formFields: FormElement[] = [];

  onDrop(event: CdkDragDrop<FormElement[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.formFields, event.previousIndex, event.currentIndex);
    } else {
      const fieldData = event.item.data;
      const newField: FormElement = {
        ...fieldData,
        id: `field-${Date.now()}`,
        placeholder: this.getDefaultPlaceholder(fieldData.type)
      };
      this.formFields.splice(event.currentIndex, 0, newField);
    }
  }

  private getDefaultPlaceholder(type: string): string {
    const placeholders: { [key: string]: string } = {
      'text': 'Escribe aquí...',
      'email': 'correo@ejemplo.com',
      'textarea': 'Escribe tu mensaje aquí...'
    };
    return placeholders[type] || '';
  }
}
