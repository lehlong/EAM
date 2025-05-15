import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelMaintenanceComponent } from './level-maintenance.component';

describe('LevelMaintenanceComponent', () => {
  let component: LevelMaintenanceComponent;
  let fixture: ComponentFixture<LevelMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelMaintenanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LevelMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
