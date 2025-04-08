import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentCorrectComponent } from './incident-correct.component';

describe('IncidentCorrectComponent', () => {
  let component: IncidentCorrectComponent;
  let fixture: ComponentFixture<IncidentCorrectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentCorrectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentCorrectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
