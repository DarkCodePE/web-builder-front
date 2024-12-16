import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';


// Angular Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {AppRoutingModule} from './app-routing.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatExpansionModule} from '@angular/material/expansion';
import {ToolboxComponent} from './components/toolbox/toolbox.component';
import {FormBuilderComponent} from './components/form-builder/form-builder.component';
import {FormCanvasComponent} from './components/form-canvas/form-canvas.component';
import {PropertiesPanelComponent} from './components/properties-panel/properties-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolboxComponent,
    FormBuilderComponent,
    FormCanvasComponent,
    PropertiesPanelComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    // Material Modules
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    DragDropModule,
    MatExpansionModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }