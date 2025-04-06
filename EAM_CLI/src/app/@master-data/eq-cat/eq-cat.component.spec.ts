import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EqCatComponent } from './eq-cat.component';

describe('EqCatComponent', () => {
  let component: EqCatComponent;
  let fixture: ComponentFixture<EqCatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EqCatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EqCatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
