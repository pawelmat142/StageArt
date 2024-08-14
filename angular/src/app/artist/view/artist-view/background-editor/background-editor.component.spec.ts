import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundEditorComponent } from './background-editor.component';

describe('BackgroundEditorComponent', () => {
  let component: BackgroundEditorComponent;
  let fixture: ComponentFixture<BackgroundEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackgroundEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
