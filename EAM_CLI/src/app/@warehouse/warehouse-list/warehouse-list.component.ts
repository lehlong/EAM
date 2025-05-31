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
  isSubmit: boolean = false;
  visible: boolean = false;
  edit: boolean = false;
  filter = new BaseFilter();
  exportFilter = new BaseFilter();
  paginationResult = new PaginationResult();
  loading: boolean = false;
  lstPlant: any[] = []

  constructor(
    private _sPlant: PlantService,
    private _service: WarehouseService,
    private fb: NonNullableFormBuilder,
    public globalService: GlobalService,
    private message: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      werk: ['', [Validators.required]],
      werkTxt: ['', [Validators.required]],
      iwerk: ['', [Validators.required]],
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
    this.getAllPlant()
  }

  getAllPlant(){
    this._sPlant.getAll().subscribe({
      next:(data) => {
      this.lstPlant = data
      }
  })
  }

  onSortChange(name: string, value: any) {
    this.filter = {
      ...this.filter,
      // SortColumn: name,
      // IsDescending: value === 'descend',
    };
    this.search();
  }

  getNamePlant(code: string){
    return this.lstPlant.find(x => x.iwerk == code)?.iwerkTxt;
  }

  search() {
    this.isSubmit = false;
    this._service.search(this.filter).subscribe({
      next: (data) => {
        this.paginationResult = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  isCodeExist(code: string): boolean {
    return this.paginationResult.data?.some(
      (accType: any) => accType.code === code
    );
  }
  submitForm(): void {
    this.isSubmit = true;
    if (this.validateForm.valid) {
      if (this.edit) {
        this._service.update(this.validateForm.getRawValue()).subscribe({
          next: (data) => {
            this.search();
          },
          error: (response) => {
            console.log(response);
          },
        });
      } else {
        const formData = this.validateForm.getRawValue();
        if (this.isCodeExist(formData.werk)) {
          this.message.error(
            `Mã ${formData.werk} đã tồn tại, vui lòng nhập lại`
          );
          return;
        }
        this._service.create(this.validateForm.getRawValue()).subscribe({
          next: (data) => {
            this.search();
          },
          error: (response) => {
            console.log(response);
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
  exportExcel() {
    return this._service
      .exportExcel(this.exportFilter)
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

  reset() {
    this.filter = new BaseFilter();
    this.search();
  }

  openCreate() {
    this.edit = false;
    this.visible = true;
  }

  resetForm() {
    this.validateForm.reset();
    this.isSubmit = false;
  }

  deleteItem(code: string) {
    this._service.delete(code).subscribe({
      next: (data) => {
        this.search();
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  openEdit(data: any) {
    console.log(data)
    this.validateForm.setValue({
      werk: data.werk,
      werkTxt: data.werkTxt,
      iwerk: data.iwerk,
      isActive: data.isActive,
    });
    setTimeout(() => {
      this.edit = true;
      this.visible = true;
    }, 200);
  }

  pageSizeChange(size: number): void {
    this.filter.currentPage = 1;
    this.filter.pageSize = size;
    this.search();
  }

  pageIndexChange(index: number): void {
    this.filter.currentPage = index;
    this.search();
  }
}
