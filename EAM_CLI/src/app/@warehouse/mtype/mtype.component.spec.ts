import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtypeComponent } from './mtype.component';

describe('MtypeComponent', () => {
  let component: MtypeComponent;
  let fixture: ComponentFixture<MtypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MtypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
