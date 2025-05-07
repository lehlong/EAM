import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CataTypeComponent } from './cata-type.component';

describe('CataTypeComponent', () => {
  let component: CataTypeComponent;
  let fixture: ComponentFixture<CataTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CataTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CataTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
