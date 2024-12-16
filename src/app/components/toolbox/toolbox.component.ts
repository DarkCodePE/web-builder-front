import { Component } from '@angular/core';
import {CdkDragStart} from '@angular/cdk/drag-drop';
import {FormElement} from '../../models/form-element.model';

@Component({
  selector: 'app-toolbox',
  template: `
    <div class="toolbox-container">
      <div class="section" *ngFor="let section of sections">
        <h3 class="section-title">
          <mat-icon class="section-icon">{{getSectionIcon(section)}}</mat-icon>
          {{section}}
        </h3>

        <div class="elements-list"
             cdkDropList
             #toolboxList="cdkDropList"
             id="toolboxList"
             [cdkDropListData]="getElementsBySection(section)"
             [cdkDropListConnectedTo]="['form-canvas-list']">

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
      overflow-y: auto;
    }

    .section {
      margin-bottom: 24px;
    }

    .section-title {
      font-weight: 500;
      margin-bottom: 12px;
      color: #333;
      display: flex;
      align-items: center;
      gap: 8px;
      padding-bottom: 8px;
      border-bottom: 2px solid #f0f0f0;
    }

    .section-icon {
      color: #666;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .elements-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .element-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      cursor: move;
      background: white;
      transition: all 0.2s ease;
      user-select: none;
    }

    .element-item:hover {
      background: #f5f5f5;
      border-color: #2196f3;
    }

    .element-item mat-icon {
      color: #666;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .element-item span {
      font-size: 14px;
      color: #333;
    }
  `],
  standalone: false
})
export class ToolboxComponent {
  sections = ['Contactos', 'General', 'Opciones'];

  formElements: FormElement[] = [
    // Sección General
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
    // Sección Contactos
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
    },
    // Sección Opciones
    {
      id: 'select',
      type: 'select',
      icon: 'arrow_drop_down_circle',
      label: 'Lista desplegable',
      section: 'Opciones',
      placeholder: 'Selecciona una opción',
      options: ['Opción 1', 'Opción 2', 'Opción 3']
    },
    {
      id: 'checkbox',
      type: 'checkbox',
      icon: 'check_box',
      label: 'Casillas de verificación',
      section: 'Opciones',
      options: ['Opción 1', 'Opción 2', 'Opción 3']
    },
    {
      id: 'radio',
      type: 'radio',
      icon: 'radio_button_checked',
      label: 'Opciones únicas',
      section: 'Opciones',
      options: ['Opción 1', 'Opción 2', 'Opción 3']
    }
  ];

  getElementsBySection(section: string): FormElement[] {
    return this.formElements.filter(element => element.section === section);
  }

  getSectionIcon(section: string): string {
    const sectionIcons: { [key: string]: string } = {
      'Contactos': 'contacts',
      'General': 'dashboard',
      'Opciones': 'list'
    };
    return sectionIcons[section] || 'folder';
  }

  onDragStarted(event: CdkDragStart, element: FormElement) {
    console.log('Dragging element:', element);
  }
}
