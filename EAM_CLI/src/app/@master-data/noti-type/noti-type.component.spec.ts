import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotiTypeComponent } from './noti-type.component';

describe('NotiTypeComponent', () => {
  let component: NotiTypeComponent;
  let fixture: ComponentFixture<NotiTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotiTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotiTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
