import { Component } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { BaseFilter, PaginationResult } from '../../models/base.model';
import { GlobalService } from '../../service/global.service';
import { WarehouseService } from '../../service/warehouse/warehouse.service';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PlantService } from '../../service/master-data/plant.service';

@Component({
  selector: 'app-warehouse-list',
  imports: [ShareModule],
  templateUrl: './warehouse-list.component.html',
  styleUrl: './warehouse-list.component.scss'
})
export class WarehouseListComponent {
  validateForm: FormGroup;
  loading: boolean = false;
  paginationResult = new PaginationResult();
  filter = new BaseFilter();
  isSubmit: boolean = false;
  visible: boolean = false;
  edit: boolean = false;
  lstIwerk: any[] = [];
  constructor(
    private fb: NonNullableFormBuilder,
    private _sWarehouse: WarehouseService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private _sPlant: PlantService
  ){
    this.validateForm = this.fb.group({
      werk: ['', [Validators.required, Validators.pattern(/^\S.*\S$|^\S+$/)]],
      iwerk: ['', [Validators.required, Validators.pattern(/^\S.*\S$|^\S+$/)]],
      werkTxt: ['', [Validators.required, Validators.pattern(/^\S.*\S$|^\S+$/)]],
      isActive: [true, [Validators.required]],
    });
    
    this.globalService.setBreadcrumb([
      {
        name: 'Danh sách kho',
        path: 'warehouse/list',
      },
    ]);
    this.globalService.getLoading().subscribe((value) => {
      this.loading = value;
    });
  }
  ngOnDestroy() {
    this.globalService.setBreadcrumb([]);
  }
   ngOnInit(): void {
    this.search();
    this.getIwerk();
  }
 getIwerk() {
    this._sPlant.getAll().subscribe({
      next: (data) => {
        this.lstIwerk = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }
  search() {
    this._sWarehouse.search(this.filter).subscribe({
      next: (data) => {
        this.paginationResult = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }
   submitForm() {
    this.isSubmit = true;
    if (this.validateForm.valid) {
      // Trim whitespace from form values
      const formData = this.validateForm.getRawValue();
      formData.werk = formData.werk?.trim();
      formData.iwerk = formData.iwerk?.trim();
      formData.werkTxt = formData.werkTxt?.trim();

      if (this.edit) {
        this._sWarehouse.update(formData).subscribe({
          next: (data) => {
            this.search();
            this.close();
            this.message.success('Cập nhật thành công');
          },
          error: (response) => {
            console.log(response);
            this.message.error('Cập nhật thất bại');
          },
        });
      } else {
        if (this.isCodeExist(formData.werk)) {
          this.message.error(
            `Kho ${formData.werk} đã tồn tại, vui lòng nhập lại`
          );
          return;
        }
        this._sWarehouse.create(formData).subscribe({
          next: (data) => {
            this.search();
            this.close();
            this.message.success('Thêm mới thành công');
          },
          error: (response) => {
            console.log(response);
            this.message.error('Thêm mới thất bại');
          },
        });
      }
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
   onClassChange(data: any):void{
    this.validateForm.patchValue({
      aname: this.lstIwerk.find(x => x.iwerk == data)?.iwerkTxt,
    });
  }
   isCodeExist(werk: string): boolean {
    return this.paginationResult.data?.some(
      (char: any) => char.werk === werk
    );
  }
 openCreate() {
    this.edit = false;
    this.visible = true;
  }
 openEdit(data: any) {
    this.validateForm.setValue({
      werk: data.werk,
      iwerk: data.iwerk,
      werkTxt: data.werkTxt,

      isActive: data.isActive,
    });
    setTimeout(() => {
      this.edit = true;
      this.visible = true;
    }, 200);
  }
    deleteItem(werk: string) {
    this._sWarehouse.delete(werk).subscribe({
      next: (data) => {
        this.search();
      },
      error: (response) => {
        console.log(response);
      },
    });
  }
    exportExcel() {
    return this._sWarehouse
      .exportExcel(this.filter)
      .subscribe((result: Blob) => {
        const blob = new Blob([result], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        const url = window.URL.createObjectURL(blob)
        var anchor = document.createElement('a')
        anchor.download = 'danh-sach-kho.xlsx'
        anchor.href = url
        anchor.click()
      })
  }
   close() {
    this.visible = false;
    this.resetForm();
  }
   getNamePlant(iwerk: string): string {
    if (!iwerk) return '';
    const cleanIwerk = iwerk.trim();
    const plant = this.lstIwerk.find(
      (x: { iwerk: string }) => x.iwerk?.trim() === cleanIwerk
    );
    return plant ? plant.iwerkTxt : cleanIwerk;
  }
  resetForm() {
    this.validateForm.reset();
    this.validateForm.patchValue({
      isActive: true
    });
    this.isSubmit = false;
  }
  reset() {
    this.filter = new BaseFilter();
    this.search();
  }

  pageIndexChange(page: number): void {
    this.filter.currentPage = page;
    this.search();
  }

  pageSizeChange(size: number): void {
    this.filter.pageSize = size;
    this.filter.currentPage = 1;
    this.search();
  }
}
