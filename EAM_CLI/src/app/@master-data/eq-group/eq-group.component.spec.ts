import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EqGroupComponent } from './eq-group.component';

describe('EqGroupComponent', () => {
  let component: EqGroupComponent;
  let fixture: ComponentFixture<EqGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EqGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EqGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
