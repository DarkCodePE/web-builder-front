import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCanvasComponent } from './form-canvas.component';

describe('FormCanvasComponent', () => {
  let component: FormCanvasComponent;
  let fixture: ComponentFixture<FormCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCanvasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
