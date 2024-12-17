import { Component } from '@angular/core';
import {FormElement} from '../../models/form-element.model';
import {FormStoreService} from '../../services/form-state.service';

@Component({
  selector: 'app-form-builder',
  template: `
    <div class="builder-container">
      <div class="toolbox-section">
        <app-toolbox></app-toolbox>
      </div>
      <div class="canvas-section">
        <app-form-canvas></app-form-canvas>
      </div>
      <div class="properties-section" *ngIf="formStore.selectedField$ | async">
        <app-properties-panel></app-properties-panel>
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
  constructor(public formStore: FormStoreService) {}
}
