import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialExportRequestComponent } from './material-export-request.component';

describe('MaterialExportRequestComponent', () => {
  let component: MaterialExportRequestComponent;
  let fixture: ComponentFixture<MaterialExportRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialExportRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialExportRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
