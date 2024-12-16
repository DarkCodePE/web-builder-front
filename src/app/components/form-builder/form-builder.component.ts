import { Component } from '@angular/core';

import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-form-builder',
  template: `
    <div class="builder-container" cdkDropListGroup>
      <app-toolbox class="toolbox"></app-toolbox>
      <app-form-canvas class="canvas"></app-form-canvas>
      <app-properties-panel class="properties"></app-properties-panel>
    </div>
  `,
  styles: [`
    .builder-container {
      display: grid;
      grid-template-columns: 250px 1fr 300px;
      gap: 20px;
      height: 100vh;
      max-height: 100vh;
      padding: 20px;
      overflow: hidden;
      background-color: #f5f5f5;
    }

    .toolbox {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .canvas {
      overflow: hidden;
      height: calc(100vh - 40px);
      border-radius: 8px;
    }

    .properties {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }
  `],
  standalone: false
})
export class FormBuilderComponent {
  // Lógica del componente principal
}
