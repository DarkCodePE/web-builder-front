import {Component, Input, OnChanges} from '@angular/core';
import {FormStoreService} from '../../services/form-state.service';
import { FormElement } from '../../models/form-element.model';
import {fieldPropertiesConfig, FieldProperty} from '../../schemas/field-properties.config';

@Component({
  selector: 'app-properties-panel',
  template: `
    <div class="properties-panel" *ngIf="formStore.selectedField$ | async as selectedElement">
      <div class="panel-header">
        <span class="title">Propiedades</span>
        <div class="header-actions">
          <button mat-button
                  color="primary"
                  [disabled]="!(formStore.isDirty$ | async)"
                  (click)="saveChanges()">
            <mat-icon>save</mat-icon>
            Guardar
          </button>
          <button mat-icon-button (click)="closePanel()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>

      <div class="panel-content">
        <mat-tab-group>
          <!-- Propiedades Generales -->
          <mat-tab label="General">
            <div class="properties-section">
              <ng-container *ngFor="let prop of getPropertiesBySection(selectedElement.type, 'general')">
                <!-- Campo de texto -->
                <div class="form-field" *ngIf="prop.type === 'text'">
                  <label [matTooltip]="prop.tooltip">
                    {{prop.label}}
                    <mat-icon *ngIf="prop.tooltip" class="help-icon">help_outline</mat-icon>
                  </label>
                  <input [type]="prop.type"
                         [ngModel]="getPropertyValue(selectedElement, prop.key)"
                         (ngModelChange)="updateProperty(selectedElement.id, prop.key, $event)">
                </div>

                <!-- Campo de área de texto -->
                <div class="form-field" *ngIf="prop.type === 'textarea'">
                  <label>{{prop.label}}</label>
                  <textarea [ngModel]="getPropertyValue(selectedElement, prop.key)"
                            (ngModelChange)="updateProperty(selectedElement.id, prop.key, $event)"
                            rows="3"></textarea>
                </div>

                <!-- Toggle -->
                <div class="form-field" *ngIf="prop.type === 'toggle'">
                  <mat-slide-toggle
                    [checked]="getPropertyValue(selectedElement, prop.key)"
                    (change)="updateProperty(selectedElement.id, prop.key, $event.checked)">
                    {{prop.label}}
                  </mat-slide-toggle>
                </div>

                <!-- Lista de opciones -->
                <div class="form-field" *ngIf="prop.type === 'options'">
                  <label>{{prop.label}}</label>
                  <div class="options-list">
                    <div *ngFor="let option of getPropertyValue(selectedElement, prop.key); let i = index"
                         class="option-item">
                      <input [ngModel]="option"
                             (ngModelChange)="updateOptionAt(selectedElement.id, prop.key, i, $event)">
                      <button mat-icon-button (click)="removeOption(selectedElement.id, prop.key, i)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                    <button mat-stroked-button (click)="addOption(selectedElement.id, prop.key)">
                      <mat-icon>add</mat-icon> Agregar opción
                    </button>
                  </div>
                </div>
              </ng-container>
            </div>
          </mat-tab>

          <!-- Validaciones -->
          <mat-tab label="Validación">
            <div class="properties-section">
              <ng-container *ngFor="let prop of getPropertiesBySection(selectedElement.type, 'validation')">
                <div class="form-field">
                  <label>{{prop.label}}</label>
                  <input [type]="prop.type"
                         [ngModel]="getPropertyValue(selectedElement, prop.key)"
                         (ngModelChange)="updateProperty(selectedElement.id, prop.key, $event)">
                </div>
              </ng-container>
            </div>
          </mat-tab>

          <!-- Apariencia -->
          <mat-tab label="Apariencia">
            <div class="properties-section">
              <ng-container *ngFor="let prop of getPropertiesBySection(selectedElement.type, 'appearance')">
                <div class="form-field">
                  <label>{{prop.label}}</label>
                  <ng-container [ngSwitch]="prop.type">
                    <input *ngSwitchCase="'number'"
                           type="number"
                           [ngModel]="getPropertyValue(selectedElement, prop.key)"
                           (ngModelChange)="updateProperty(selectedElement.id, prop.key, $event)">
                    <mat-select *ngSwitchCase="'select'"
                                [ngModel]="getPropertyValue(selectedElement, prop.key)"
                                (ngModelChange)="updateProperty(selectedElement.id, prop.key, $event)">
                      <mat-option *ngFor="let opt of prop.options"
                                  [value]="opt.value">
                        {{opt.label}}
                      </mat-option>
                    </mat-select>
                  </ng-container>
                </div>
              </ng-container>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .properties-panel {
      width: 100%;
      height: 100%;
      background: white;
      border-left: 1px solid #e0e0e0;
      display: flex;
      flex-direction: column;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .title {
      font-weight: 500;
      font-size: 16px;
    }

    .panel-content {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }

    .properties-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-field label {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    .input-with-counter {
      position: relative;
    }

    .counter {
      position: absolute;
      right: 8px;
      bottom: 8px;
      font-size: 12px;
      color: #666;
    }

    input, textarea {
      padding: 8px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-size: 14px;
    }

    .validation-field {
      margin-top: 8px;
      padding: 8px;
      background: #f5f5f5;
      border-radius: 4px;
    }

    .options-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .option-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    :host ::ng-deep .mat-tab-group {
      height: 100%;
    }

    :host ::ng-deep .mat-tab-body-wrapper {
      flex: 1;
    }
  `],
  standalone: false
})
export class PropertiesPanelComponent{

  constructor(public formStore: FormStoreService) {}

  getPropertiesBySection(fieldType: string, section: string): FieldProperty[] {
    return (fieldPropertiesConfig[fieldType] || []).filter(prop => prop.section === section);
  }

  getPropertyValue(field: FormElement, key: string): any {
    // @ts-ignore
    return field[key] ?? this.getDefaultValue(field.type, key);
  }

  getDefaultValue(type: string, key: string): any {
    const property = fieldPropertiesConfig[type]?.find(p => p.key === key);
    return property?.defaultValue;
  }

  updateProperty(fieldId: string, key: string, value: any) {
    this.formStore.updateFieldProperties(fieldId, { [key]: value });
  }

  updateOptionAt(fieldId: string, key: string, index: number, value: string) {
    const field = this.formStore.selectedField$.getValue();
    if (!field) return;

    // @ts-ignore
    const options = [...(field[key] || [])];
    options[index] = value;
    this.updateProperty(fieldId, key, options);
  }

  addOption(fieldId: string, key: string) {
    const field = this.formStore.selectedField$.getValue();
    if (!field) return;

    // @ts-ignore
    const options = [...(field[key] || [])];
    options.push(`Opción ${options.length + 1}`);
    this.updateProperty(fieldId, key, options);
  }

  removeOption(fieldId: string, key: string, index: number) {
    const field = this.formStore.selectedField$.getValue();
    if (!field) return;

    // @ts-ignore
    const options = [...(field[key] || [])];
    options.splice(index, 1);
    this.updateProperty(fieldId, key, options);
  }

  saveChanges() {
    this.formStore.saveChanges();
  }

  closePanel() {
    this.formStore.selectField(null);
  }
}
