import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlgrpComponent } from './plgrp.component';

describe('PlgrpComponent', () => {
  let component: PlgrpComponent;
  let fixture: ComponentFixture<PlgrpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlgrpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlgrpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
