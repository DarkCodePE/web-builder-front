import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {FormElement} from '../models/form-element.model';

interface FormState {
  fields: FormElement[];
  selectedFieldId: string | null;
  isDirty: boolean;
}

const initialState: FormState = {
  fields: [],
  selectedFieldId: null,
  isDirty: false
};

@Injectable({
  providedIn: 'root'
})
export class FormStoreService {
  private state = new BehaviorSubject<FormState>(initialState);

  // Selectors
  fields$ = new BehaviorSubject<FormElement[]>([]);
  selectedField$ = new BehaviorSubject<FormElement | null>(null);
  isDirty$ = new BehaviorSubject<boolean>(false);

  constructor() {
    // Subscribe to state changes to update selectors
    this.state.subscribe(state => {
      this.fields$.next(state.fields);
      this.isDirty$.next(state.isDirty);
      this.selectedField$.next(
        state.fields.find(field => field.id === state.selectedFieldId) || null
      );
    });
  }

  // Actions
  updateFieldProperties(fieldId: string, properties: Partial<FormElement>) {
    const currentState = this.state.getValue();
    const updatedFields = currentState.fields.map(field =>
      field.id === fieldId ? { ...field, ...properties } : field
    );

    this.state.next({
      ...currentState,
      fields: updatedFields,
      isDirty: true
    });
  }

  addField(field: FormElement) {
    const currentState = this.state.getValue();
    this.state.next({
      ...currentState,
      fields: [...currentState.fields, field],
      isDirty: true
    });
  }

  removeField(fieldId: string) {
    const currentState = this.state.getValue();
    this.state.next({
      ...currentState,
      fields: currentState.fields.filter(field => field.id !== fieldId),
      isDirty: true
    });
  }

  reorderFields(fields: FormElement[]) {
    const currentState = this.state.getValue();
    this.state.next({
      ...currentState,
      fields,
      isDirty: true
    });
  }

  selectField(fieldId: string | null) {
    const currentState = this.state.getValue();
    this.state.next({
      ...currentState,
      selectedFieldId: fieldId
    });
  }

  saveChanges() {
    const currentState = this.state.getValue();
    // Aquí podrías agregar lógica para guardar en backend
    this.state.next({
      ...currentState,
      isDirty: false
    });
  }

  // Helper method para obtener el estado actual
  getState(): FormState {
    return this.state.getValue();
  }
}
