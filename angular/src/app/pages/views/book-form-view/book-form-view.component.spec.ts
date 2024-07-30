import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookFormViewComponent } from './book-form-view.component';

describe('BookFormViewComponent', () => {
  let component: BookFormViewComponent;
  let fixture: ComponentFixture<BookFormViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookFormViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookFormViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
