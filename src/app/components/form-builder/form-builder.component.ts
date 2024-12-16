import { Component } from '@angular/core';
import {FormElement} from '../../models/form-element.model';

@Component({
  selector: 'app-form-builder',
  template: `
    <div class="builder-container">
      <div class="toolbox-section">
        <app-toolbox></app-toolbox>
      </div>
      <div class="canvas-section">
        <app-form-canvas
          (fieldSelected)="onFieldSelected($event)"
          (fieldSettingsRequested)="onFieldSettingsRequested($event)">
        </app-form-canvas>
      </div>
      <div class="properties-section" *ngIf="showProperties">
        <app-properties-panel
          [selectedElement]="selectedField">
        </app-properties-panel>
      </div>
    </div>
  `,
  styles: [`
    .builder-container {
      display: grid;
      grid-template-columns: 250px 1fr 300px;
      height: 100vh;
      overflow: hidden;
    }

    .toolbox-section {
      border-right: 1px solid #e0e0e0;
      background: white;
      height: 100%;
      overflow-y: auto;
    }

    .canvas-section {
      background: #f5f5f5;
      height: 100%;
      overflow-y: auto;
    }

    .properties-section {
      border-left: 1px solid #e0e0e0;
      background: white;
      height: 100%;
      overflow-y: auto;
    }
  `],
  standalone: false
})
export class FormBuilderComponent {
  selectedField: FormElement | null = null;
  showProperties = false;

  onFieldSelected(field: FormElement | null) {
    this.selectedField = field;
  }

  onFieldSettingsRequested(field: FormElement) {
    this.selectedField = field;
    this.showProperties = true;
  }
}
