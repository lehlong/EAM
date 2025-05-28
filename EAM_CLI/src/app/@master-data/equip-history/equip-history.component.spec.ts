import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipHistoryComponent } from './equip-history.component';

describe('EquipHistoryComponent', () => {
  let component: EquipHistoryComponent;
  let fixture: ComponentFixture<EquipHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
