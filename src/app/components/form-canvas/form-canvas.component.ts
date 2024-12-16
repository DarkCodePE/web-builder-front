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
    <div class="canvas-container" #canvasContainer>
      <div class="form-preview">
        <h2 class="form-title">Get a Price Quote</h2>

        <!-- Sistema de guías -->
        <div class="grid-guides" *ngIf="isDragging">
          <div class="grid-line"
               *ngFor="let guide of dropGuides"
               [class.active]="guide.isActive"
               [style.top.px]="guide.top"></div>
        </div>

        <!-- Contenedor de campos -->
        <div class="form-fields-container"
             cdkDropList
             #dropList="cdkDropList"
             [cdkDropListData]="formFields"
             (cdkDropListDropped)="onDrop($event)"
             (cdkDropListEntered)="onDragEnter($event)"
             (cdkDropListExited)="onDragLeave()">

          <!-- Indicador de drop -->
          <div class="drop-zone-indicator"
               *ngIf="showDropIndicator"
               [style.top.px]="dropIndicatorY"
               [class.is-valid]="isValidDropPosition">
            <div class="drop-line"></div>
            <div class="drop-preview"></div>
          </div>

          <!-- Campos del formulario -->
          <div *ngFor="let field of formFields; let i = index"
               class="field-wrapper"
               [class.dragging]="draggedIndex === i"
               [class.field-drag-over]="dragOverIndex === i"
               [attr.data-index]="i"
               cdkDrag
               (cdkDragStarted)="onDragStarted($event, i)"
               (cdkDragMoved)="onDragMoved($event)"
               (cdkDragEnded)="onDragEnded()"
               [cdkDragData]="field">

            <!-- Preview de arrastre -->
            <div *cdkDragPreview class="drag-preview">
              <mat-icon>{{field.icon}}</mat-icon>
              <span>{{field.label}}</span>
            </div>

            <!-- Placeholder durante arrastre -->
            <div *cdkDragPlaceholder class="field-placeholder"></div>

            <!-- Campo real -->
            <div [ngSwitch]="field.type" class="field-content">
              <!-- Campo de texto -->
              <div *ngSwitchCase="'text'" class="form-field">
                <label class="field-label">{{field.label}}</label>
                <input type="text"
                       [placeholder]="field.placeholder || ''"
                       class="field-input">
              </div>

              <!-- Campo de email -->
              <div *ngSwitchCase="'email'" class="form-field">
                <label class="field-label">{{field.label}}</label>
                <div class="input-with-icon">
                  <input type="email"
                         [placeholder]="field.placeholder || ''"
                         class="field-input">
                  <mat-icon>email</mat-icon>
                </div>
              </div>

              <!-- Campo de área de texto -->
              <div *ngSwitchCase="'textarea'" class="form-field">
                <label class="field-label">{{field.label}}</label>
                <textarea class="field-textarea"
                         [placeholder]="field.placeholder || ''"></textarea>
              </div>
            </div>
          </div>

          <!-- Mensaje cuando está vacío -->
          <div *ngIf="formFields.length === 0" class="empty-state">
            <mat-icon>add_circle_outline</mat-icon>
            <p>Arrastra elementos aquí para comenzar</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .canvas-container {
      height: 100%;
      padding: 20px;
      background-color: #f5f5f5;
      position: relative;
      overflow: auto;
    }

    .form-preview {
      background: white;
      border-radius: 8px;
      padding: 24px;
      min-height: 500px;
      position: relative;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-title {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 24px;
      color: #2c3e50;
    }

    .form-fields-container {
      position: relative;
      display: grid;
      gap: 16px;
      padding: 8px;
      min-height: 200px;
    }

    .grid-guides {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }

    .grid-line {
      position: absolute;
      left: 0;
      right: 0;
      height: 2px;
      background: rgba(33, 150, 243, 0.1);
      transition: all 0.2s ease;
    }

    .grid-line.active {
      background: #2196f3;
      height: 2px;
      transform: scaleY(1.5);
    }

    .field-wrapper {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      transition: all 0.2s ease;
      position: relative;
    }

    .field-wrapper:hover {
      border-color: #2196f3;
      box-shadow: 0 2px 4px rgba(33, 150, 243, 0.1);
    }

    .field-wrapper.dragging {
      opacity: 0.5;
    }

    .field-wrapper.field-drag-over {
      border: 2px dashed #2196f3;
      margin: 8px 0;
    }

    .field-content {
      padding: 12px;
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
      transition: all 0.2s ease;
    }

    .field-input:focus, .field-textarea:focus {
      border-color: #2196f3;
      outline: none;
      box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
    }

    .input-with-icon {
      position: relative;
    }

    .input-with-icon mat-icon {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #666;
    }

    .drag-preview {
      padding: 12px;
      background: white;
      border-radius: 4px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .field-placeholder {
      background: #f5f5f5;
      border: 2px dashed #ccc;
      border-radius: 4px;
      height: 60px;
      margin: 8px 0;
    }

    .drop-zone-indicator {
      position: absolute;
      left: 0;
      right: 0;
      pointer-events: none;
      z-index: 1000;
    }

    .drop-line {
      height: 2px;
      background: #2196f3;
      margin: 0 -8px;
    }

    .drop-preview {
      height: 60px;
      background: rgba(33, 150, 243, 0.1);
      border: 2px dashed #2196f3;
      border-radius: 4px;
      margin-top: -1px;
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

    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #ccc;
    }
  `],
  standalone: false
})
export class FormCanvasComponent implements OnInit {
  @ViewChild('canvasContainer') canvasContainer!: ElementRef;

  formFields: FormElement[] = [];
  dropGuides: DropGuide[] = [];
  isDragging = false;
  showDropIndicator = false;
  dropIndicatorY = 0;
  dragOverIndex = -1;
  draggedIndex = -1;
  isValidDropPosition = false;
  gridSize = 16; // Tamaño de la cuadrícula en píxeles

  ngOnInit() {
    this.initializeDropGuides();
  }
  // Añade este método para actualizar las guías
  private updateDropGuides() {
    const fields = this.formFields;
    // Actualizar las guías basadas en las posiciones actuales de los campos
    this.dropGuides = fields.map((_, index) => ({
      top: index * this.gridSize,
      isActive: false
    }));

    // Añadir una guía adicional para la última posición
    this.dropGuides.push({
      top: fields.length * this.gridSize,
      isActive: false
    });
  }

// Añade los métodos faltantes para el manejo de eventos drag & drop
  onDragEnter(event: CdkDragEnter) {
    this.showDropIndicator = true;
    // Actualizar guías cuando un elemento entra en la zona de drop
    this.updateDropGuides();
  }

  onDragLeave() {
    this.showDropIndicator = false;
    this.dragOverIndex = -1;
    this.dropGuides.forEach(guide => guide.isActive = false);
  }

  private initializeDropGuides() {
    // Crear guías cada 16px (tamaño de la cuadrícula)
    const containerHeight = 500; // Altura mínima del contenedor
    const guides = Math.floor(containerHeight / this.gridSize);

    this.dropGuides = Array(guides).fill(0).map((_, index) => ({
      top: index * this.gridSize,
      isActive: false
    }));
  }

  onDragStarted(event: any, index: number) {
    this.isDragging = true;
    this.draggedIndex = index;
    this.updateDropGuides();
  }

  onDragEnded() {
    this.isDragging = false;
    this.draggedIndex = -1;
    this.dragOverIndex = -1;
    this.showDropIndicator = false;
    this.dropGuides.forEach(guide => guide.isActive = false);
  }

  onDragMoved(event: CdkDragMove) {
    if (!this.canvasContainer) return;

    const containerRect = this.canvasContainer.nativeElement.getBoundingClientRect();
    const y = event.pointerPosition.y - containerRect.top;

    // Actualizar posición del indicador
    this.dropIndicatorY = this.snapToGrid(y);
    this.showDropIndicator = true;

    // Actualizar guías activas
    this.updateActiveGuides(y);

    // Calcular índice más cercano
    this.calculateDropIndex(y);
  }

  private snapToGrid(y: number): number {
    return Math.round(y / this.gridSize) * this.gridSize;
  }

  private updateActiveGuides(y: number) {
    const snapPoint = this.snapToGrid(y);
    this.dropGuides.forEach(guide => {
      guide.isActive = Math.abs(guide.top - snapPoint) < 2;
    });
  }

  private calculateDropIndex(y: number) {
    const fields = this.formFields;
    const snapPoint = this.snapToGrid(y);

    for (let i = 0; i < fields.length; i++) {
      const element = document.querySelector(`[data-index="${i}"]`);
      if (element) {
        const rect = element.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        if (y < midY) {
          this.dragOverIndex = i;
          this.isValidDropPosition = true;
          return;
        }
      }
    }
    this.dragOverIndex = fields.length;
    this.isValidDropPosition = true;
  }

  onDrop(event: CdkDragDrop<FormElement[]>) {
    this.showDropIndicator = false;
    this.isDragging = false;
    this.dragOverIndex = -1;

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

    // Actualizar posiciones en la cuadrícula
    this.updateFieldPositions();
  }

  private updateFieldPositions() {
    // Asegurar que todos los campos estén alineados a la cuadrícula
    this.formFields.forEach((field, index) => {
      const element = document.querySelector(`[data-index="${index}"]`);
      if (element) {
        const top = index * this.gridSize;
        (element as HTMLElement).style.transform = `translateY(${top}px)`;
      }
    });
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
