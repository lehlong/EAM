import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseFilter, PaginationResult } from '../../models/base.model';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GlobalService } from '../../service/global.service';
import { ClassHService } from '../../service/master-data/class-h.service';
import { ShareModule } from '../../shared/share-module';

@Component({
  selector: 'app-class-h',
  imports: [ShareModule],
  templateUrl: './class-h.component.html',
  styleUrl: './class-h.component.scss'
})
export class ClassHComponent implements OnInit, OnDestroy {
  validateForm: FormGroup;
  isSubmit: boolean = false;
  visible: boolean = false;
  edit: boolean = false;
  filter = new BaseFilter();
  paginationResult = new PaginationResult();
  loading: boolean = false;

  constructor(
    private _service: ClassHService,
    private fb: NonNullableFormBuilder,
    private globalService: GlobalService,
    private message: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      class:['',Validators.required],
      klart: [''],
      classTxt: ['', [Validators.required]],
      isActive: [true, [Validators.required]],
    });
    this.globalService.setBreadcrumb([
      {
        name: 'Nhóm đặc tính',
        path: 'master-data/class-h',
      },
    ]);
    this.globalService.getLoading().subscribe((value: boolean) => {
      this.loading = value;
    });
  }

  ngOnDestroy() {
    this.globalService.setBreadcrumb([]);
  }

  ngOnInit(): void {
    this.search();
  }

  onSortChange(column: string, value: string): void {
    this.filter = {
      ...this.filter,
      //SortColumn: column,
      //IsDescending: value === 'descend',
    };
    this.search();
  }
  exportExcel() {
    return this._service
      .exportExcel(this.filter)
      .subscribe((result: Blob) => {
        const blob = new Blob([result], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        const url = window.URL.createObjectURL(blob)
        var anchor = document.createElement('a')
        anchor.download = 'danh-sach-nhom-dac-tinh.xlsx'
        anchor.href = url
        anchor.click()
      })
  }

  search(): void {
    this.isSubmit = false;
    this._service.search(this.filter).subscribe({
      next: (data: PaginationResult) => {
        this.paginationResult = data;
      },
      error: (response: any) => {
        console.log(response);
      },
    });
  }

  isCodeExist(klart: string): boolean {
    return this.paginationResult.data?.some(
      (item: any) => item.klart === klart
    );
  }

  submitForm(): void {
    this.isSubmit = true;
    if (this.validateForm.valid) {
      if (this.edit) {
        this._service.update(this.validateForm.getRawValue()).subscribe({
          next: (data: any) => {
            this.search();
          },
          error: (response: any) => {
            console.log(response);
          },
        });
      } else {
        const formData = this.validateForm.getRawValue();
        if (this.isCodeExist(formData.klart)) {
          this.message.error(
            `Class ${formData.klart} đã tồn tại, vui lòng nhập lại`
          );
          return;
        }
        this._service.create(this.validateForm.getRawValue()).subscribe({
          next: (data: any) => {
            this.search();
          },
          error: (response: any) => {
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

  close(): void {
    this.visible = false;
    this.resetForm();
  }

  reset(): void {
    this.filter = new BaseFilter();
    this.search();
  }

  openCreate(): void {
    this.edit = false;
    this.visible = true;
  }

  resetForm(): void {
    this.validateForm.reset();
    this.validateForm.patchValue({
      isActive: true
    });
    this.isSubmit = false;
  }

  deleteItem(klart: string): void {
    this._service.delete(klart).subscribe({
      next: (data: any) => {
        this.search();
      },
      error: (response: any) => {
        console.log(response);
      },
    });
  }

  openEdit(data: any): void {
    this.validateForm.setValue({
      class: data.class,
      klart: data.klart,
      classTxt: data.classTxt,
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
