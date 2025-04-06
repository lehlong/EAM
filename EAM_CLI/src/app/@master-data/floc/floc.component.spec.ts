import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlocComponent } from './floc.component';

describe('FlocComponent', () => {
  let component: FlocComponent;
  let fixture: ComponentFixture<FlocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
