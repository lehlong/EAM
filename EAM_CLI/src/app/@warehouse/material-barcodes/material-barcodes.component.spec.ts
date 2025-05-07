import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialBarcodesComponent } from './material-barcodes.component';

describe('MaterialBarcodesComponent', () => {
  let component: MaterialBarcodesComponent;
  let fixture: ComponentFixture<MaterialBarcodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialBarcodesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialBarcodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
