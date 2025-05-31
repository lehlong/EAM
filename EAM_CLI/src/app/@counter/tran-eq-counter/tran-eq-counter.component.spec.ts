import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranEqCounterComponent } from './tran-eq-counter.component';

describe('TranEqCounterComponent', () => {
  let component: TranEqCounterComponent;
  let fixture: ComponentFixture<TranEqCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranEqCounterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranEqCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
