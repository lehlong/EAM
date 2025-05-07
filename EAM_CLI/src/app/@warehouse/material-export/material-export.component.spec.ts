import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialExportComponent } from './material-export.component';

describe('MaterialExportComponent', () => {
  let component: MaterialExportComponent;
  let fixture: ComponentFixture<MaterialExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialExportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
