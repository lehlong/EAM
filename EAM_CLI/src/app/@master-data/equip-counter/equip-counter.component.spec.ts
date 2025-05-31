import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipCounterComponent } from './equip-counter.component';

describe('EquipCounterComponent', () => {
  let component: EquipCounterComponent;
  let fixture: ComponentFixture<EquipCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipCounterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
