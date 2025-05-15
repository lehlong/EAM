import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanOrderComponent } from './plan-order.component';

describe('PlanOrderComponent', () => {
  let component: PlanOrderComponent;
  let fixture: ComponentFixture<PlanOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
