import { Component } from '@angular/core';
import {CdkDragStart} from '@angular/cdk/drag-drop';
import {FormElement} from '../../models/form-element.model';



@Component({
  selector: 'app-toolbox',
  template: `
    <div class="toolbox-container">
      <div class="section" *ngFor="let section of sections">
        <h3 class="section-title">{{section}}</h3>
        <div class="elements-list"
             cdkDropList
             [cdkDropListConnectedTo]="['form-canvas']"
             [cdkDropListData]="getElementsBySection(section)">
          <div *ngFor="let element of getElementsBySection(section)"
               class="element-item"
               cdkDrag
               [cdkDragData]="element">
            <mat-icon>{{element.icon}}</mat-icon>
            <span>{{element.label}}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toolbox-container {
      padding: 16px;
      background: white;
      height: 100%;
    }

    .section {
      margin-bottom: 20px;
    }

    .section-title {
      font-weight: 500;
      margin-bottom: 12px;
      color: #333;
    }

    .elements-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .element-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      cursor: move;
      background: white;
      transition: all 0.2s ease;
    }

    .element-item:hover {
      background: #f5f5f5;
      border-color: #2196f3;
    }

    mat-icon {
      color: #666;
    }
  `],
  standalone: false
})
export class ToolboxComponent {
  sections = ['Contactos', 'General'];

  formElements: FormElement[] = [
    {
      id: 'text',
      type: 'text',
      icon: 'text_fields',
      label: 'Respuesta corta',
      section: 'General',
      placeholder: 'Escribe tu respuesta'
    },
    {
      id: 'textarea',
      type: 'textarea',
      icon: 'notes',
      label: 'Respuesta larga',
      section: 'General',
      placeholder: 'Escribe tu respuesta detallada'
    },
    {
      id: 'name',
      type: 'text',
      icon: 'person',
      label: 'Nombre',
      section: 'Contactos',
      placeholder: 'Escribe tu nombre'
    },
    {
      id: 'email',
      type: 'email',
      icon: 'email',
      label: 'Email',
      section: 'Contactos',
      placeholder: 'correo@ejemplo.com'
    }
  ];

  getElementsBySection(section: string): FormElement[] {
    return this.formElements.filter(element => element.section === section);
  }

  onDragStarted(event: CdkDragStart, element: FormElement) {
    console.log('Dragging element:', element);
  }
}
