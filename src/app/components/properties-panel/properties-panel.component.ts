import {Component, Input, OnChanges} from '@angular/core';
import { FormStateService } from '../../services/form-state.service';
import { FormElement } from '../../models/form-element.model';
import {fieldPropertiesConfig, FieldProperty} from '../../schemas/field-properties.config';

@Component({
  selector: 'app-properties-panel',
  template: `
    <div class="properties-panel" *ngIf="selectedElement">
      <div class="panel-header">
        <span class="title">Propiedades</span>
        <button mat-icon-button (click)="closePanel()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="panel-content">
        <mat-tab-group>
          <!-- Propiedades Generales -->
          <mat-tab label="General">
            <div class="properties-section">
              <ng-container *ngFor="let prop of getPropertiesBySection('general')">
                <!-- Campo de texto -->
                <div class="form-field" *ngIf="prop.type === 'text'">
                  <label [matTooltip]="prop.tooltip">
                    {{prop.label}}
                    <mat-icon *ngIf="prop.tooltip" class="help-icon">help_outline</mat-icon>
                  </label>
                  <input [type]="prop.type"
                         [ngModel]="getPropertyValue(prop.key)"
                         (ngModelChange)="updateProperty(prop.key, $event)">
                </div>

                <!-- Campo de área de texto -->
                <div class="form-field" *ngIf="prop.type === 'textarea'">
                  <label>{{prop.label}}</label>
                  <textarea [ngModel]="getPropertyValue(prop.key)"
                            (ngModelChange)="updateProperty(prop.key, $event)"
                            rows="3"></textarea>
                </div>

                <!-- Toggle -->
                <div class="form-field" *ngIf="prop.type === 'toggle'">
                  <mat-slide-toggle
                    [ngModel]="getPropertyValue(prop.key)"
                    (ngModelChange)="updateProperty(prop.key, $event)">
                    {{prop.label}}
                  </mat-slide-toggle>
                </div>

                <!-- Lista de opciones -->
                <div class="form-field" *ngIf="prop.type === 'options'">
                  <label>{{prop.label}}</label>
                  <div class="options-list">
                    <div *ngFor="let option of getPropertyValue(prop.key); let i = index"
                         class="option-item">
                      <input [ngModel]="option"
                             (ngModelChange)="updateOption(prop.key, i, $event)">
                      <button mat-icon-button (click)="removeOption(prop.key, i)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                    <button mat-stroked-button (click)="addOption(prop.key)">
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
              <ng-container *ngFor="let prop of getPropertiesBySection('validation')">
                <div class="form-field">
                  <label>{{prop.label}}</label>
                  <input [type]="prop.type"
                         [ngModel]="getPropertyValue(prop.key)"
                         (ngModelChange)="updateProperty(prop.key, $event)">
                </div>
              </ng-container>
            </div>
          </mat-tab>

          <!-- Apariencia -->
          <mat-tab label="Apariencia">
            <div class="properties-section">
              <ng-container *ngFor="let prop of getPropertiesBySection('appearance')">
                <div class="form-field">
                  <label>{{prop.label}}</label>
                  <ng-container [ngSwitch]="prop.type">
                    <input *ngSwitchCase="'number'"
                           type="number"
                           [ngModel]="getPropertyValue(prop.key)"
                           (ngModelChange)="updateProperty(prop.key, $event)">
                    <mat-select *ngSwitchCase="'select'"
                                [ngModel]="getPropertyValue(prop.key)"
                                (ngModelChange)="updateProperty(prop.key, $event)">
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
export class PropertiesPanelComponent implements OnChanges {
  @Input() selectedElement: FormElement | null = null;
  properties: any = {};
  availableProperties: FieldProperty[] = [];

  constructor(private formStateService: FormStateService) {}

  ngOnChanges() {
    if (this.selectedElement) {
      this.initializeProperties();
    }
  }

  private initializeProperties() {
    if (!this.selectedElement) return;

    this.availableProperties = fieldPropertiesConfig[this.selectedElement.type] || [];
    this.properties = {};

    // Inicializar con valores por defecto
    this.availableProperties.forEach(prop => {
      // @ts-ignore
      this.properties[prop.key] = this.selectedElement?.[prop.key] || prop.defaultValue;
    });
  }

  getPropertiesBySection(section: string): FieldProperty[] {
    return this.availableProperties.filter(prop => prop.section === section);
  }

  getPropertyValue(key: string): any {
    return this.properties[key];
  }

  updateProperty(key: string, value: any) {
    this.properties[key] = value;
    this.formStateService.updateControl(this.selectedElement!.id, this.properties);
  }

  updateOption(propKey: string, index: number, value: string) {
    const options = [...this.properties[propKey]];
    options[index] = value;
    this.updateProperty(propKey, options);
  }

  addOption(propKey: string) {
    const options = [...this.properties[propKey]];
    options.push(`Opción ${options.length + 1}`);
    this.updateProperty(propKey, options);
  }

  removeOption(propKey: string, index: number) {
    const options = [...this.properties[propKey]];
    options.splice(index, 1);
    this.updateProperty(propKey, options);
  }
  closePanel() {
    this.selectedElement = null;
  }
}
