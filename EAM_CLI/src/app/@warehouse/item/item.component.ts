import { Component } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { BaseFilter, PaginationResult } from '../../models/base.model';
import { ItemService } from '../../service/warehouse/item.service';
import { GlobalService } from '../../service/global.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DropdownService } from '../../service/dropdown/dropdown.service';

@Component({
  selector: 'app-item',
  imports: [ShareModule],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent {

  validateForm: FormGroup;
  isSubmit: boolean = false;
  visible: boolean = false;
  edit: boolean = false;
  filter = new BaseFilter();
  exportFilter = new BaseFilter();
  paginationResult = new PaginationResult();
  loading: boolean = false;
  lstmtype: any[] = [];
  lstmtgrp: any[] = [];
  lstUnit: any[] = [];

  constructor(
    private _service: ItemService,
    private fb: NonNullableFormBuilder,
    public globalService: GlobalService,
    private message: NzMessageService,
    private dropdown: DropdownService
  ) {
    this.validateForm = this.fb.group({
      matnr: ['', [Validators.required]],
      maktx: ['', [Validators.required]],
      mtart: ['', [Validators.required]],
      matkl: ['', [Validators.required]],
      bismt: ['', [Validators.required]],
      meins: ['', [Validators.required]],
      mfrnr: ['', [Validators.required]],
      sledbbd: [null, [Validators.required]],
      model: ['', [Validators.required]],
      isActive: [true, [Validators.required]],
    });
    this.globalService.setBreadcrumb([
      {
        name: 'Danh sách vật tư',
        path: 'warehouse/item',
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
    this.getMtype();
    this.getMtgrp();
    this.getUnit();
  }

  onSortChange(column: string, value: any) {
    this.filter = {
      ...this.filter,
      //SortColumn: column,
      //IsDescending: value === 'descend',
    };
    this.search();
  }
  getMtype() {
    this.dropdown.getAllMtype().subscribe((data) => {
      this.lstmtype = data;
    });
  }
  getMtgrp() {
    this.dropdown.getAllMtgrp().subscribe((data) => {
      this.lstmtgrp = data;
    });
  }
  getUnit() {
    this.dropdown.getAllUnit().subscribe((data) => {
      this.lstUnit = data;
    });
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
        if (this.isCodeExist(formData.code)) {
          this.message.error(
            `Mã ${formData.code} đã tồn tại, vui lòng nhập lại`
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
        anchor.download = 'danh-sach-vat-tu.xlsx'
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

  openEdit(data: {
    matnr: string;
    maktx: string;
    mtart: string;
    matkl: string;
    bismt: string;
    meins: string;
    mfrnr: string;
    sledbbd: Date;
    model: string;
    isActive: boolean;
  }) {
    this.validateForm.setValue({
      matnr: data.matnr,
      maktx: data.maktx,
      mtart: data.mtart,
      matkl: data.matkl,
      bismt: data.bismt,
      meins: data.meins,
      mfrnr: data.mfrnr,
      sledbbd: data.sledbbd ? new Date(data.sledbbd) : null,
      model: data.model,
      isActive: data.isActive
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
