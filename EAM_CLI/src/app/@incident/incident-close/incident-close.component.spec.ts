import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentCloseComponent } from './incident-close.component';

describe('IncidentCloseComponent', () => {
  let component: IncidentCloseComponent;
  let fixture: ComponentFixture<IncidentCloseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentCloseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
