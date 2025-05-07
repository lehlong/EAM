import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageStatusComponent } from './usage-status.component';

describe('UsageStatusComponent', () => {
  let component: UsageStatusComponent;
  let fixture: ComponentFixture<UsageStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsageStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsageStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
