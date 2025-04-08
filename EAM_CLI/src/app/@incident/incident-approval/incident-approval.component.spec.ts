import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentApprovalComponent } from './incident-approval.component';

describe('IncidentApprovalComponent', () => {
  let component: IncidentApprovalComponent;
  let fixture: ComponentFixture<IncidentApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
