import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface FormControl {
  id: string;
  type: string;
  properties: {
    label: string;
    required: boolean;
    // ... más propiedades
  };
}

@Injectable({
  providedIn: 'root'
})
export class FormStateService {
  private formControls = new BehaviorSubject<FormControl[]>([]);
  currentControls$ = this.formControls.asObservable();

  addControl(control: FormControl) {
    const current = this.formControls.value;
    this.formControls.next([...current, control]);
  }

  updateControl(id: string, properties: any) {
    const current = this.formControls.value;
    const updated = current.map(control =>
      control.id === id ? { ...control, properties } : control
    );
    this.formControls.next(updated);
  }
}
