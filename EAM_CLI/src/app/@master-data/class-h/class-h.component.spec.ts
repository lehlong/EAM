import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassHComponent } from './class-h.component';

describe('ClassHComponent', () => {
  let component: ClassHComponent;
  let fixture: ComponentFixture<ClassHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassHComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
