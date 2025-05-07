import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryMaterialsComponent } from './inventory-materials.component';

describe('InventoryMaterialsComponent', () => {
  let component: InventoryMaterialsComponent;
  let fixture: ComponentFixture<InventoryMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryMaterialsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
