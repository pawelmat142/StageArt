import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProcessorComponent } from './form-processor.component';

describe('FormProcessorComponent', () => {
  let component: FormProcessorComponent;
  let fixture: ComponentFixture<FormProcessorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormProcessorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormProcessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
