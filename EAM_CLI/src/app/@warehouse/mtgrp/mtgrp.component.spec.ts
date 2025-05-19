import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtgrpComponent } from './mtgrp.component';

describe('MtgrpComponent', () => {
  let component: MtgrpComponent;
  let fixture: ComponentFixture<MtgrpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MtgrpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MtgrpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
