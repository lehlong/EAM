import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { PaginationResult, BaseFilter } from '../../models/base.model';
import { ActiveStatusService } from '../../service/master-data/active-status.service';
import { GlobalService } from '../../service/global.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-active-status',
  standalone: true,
  imports: [ShareModule],
  templateUrl: './active-status.component.html',
  styleUrl: './active-status.component.scss',
})
export class ActiveStatusComponent implements OnInit, OnDestroy {
  validateForm: FormGroup;
  isSubmit: boolean = false;
  visible: boolean = false;
  edit: boolean = false;
  filter = new BaseFilter();
  paginationResult = new PaginationResult();
  loading: boolean = false;

  constructor(
    private _service: ActiveStatusService,
    private fb: NonNullableFormBuilder,
    public globalService: GlobalService,
    private message: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      isActive: [true, [Validators.required]],
    });
    this.globalService.setBreadcrumb([
      {
        name: 'Trạng thái hoạt động',
        path: 'master-data/active-status',
      },
    ]);
    this.globalService.getLoading().subscribe((value: boolean) => {
      this.loading = value;
    });
  }
  
  ngOnDestroy(): void {
    this.globalService.setBreadcrumb([]);
  }

  ngOnInit(): void {
    this.search();
  }

  onSortChange(name: string, value: any): void {
    this.filter = {
      ...this.filter,
      // SortColumn: name,
      // IsDescending: value === 'descend',
    };
    this.search();
  }

  search(): void {
    this.isSubmit = false;
    this._service.search(this.filter).subscribe({
      next: (data: any) => {
        this.paginationResult = data;
      },
      error: (response: any) => {
        console.log(response);
      },
    });
  }

  isCodeExist(code: string): boolean {
    return this.paginationResult.data?.some(
      (activeStatus: any) => activeStatus.code === code
    );
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
        anchor.download = 'danh-sach-trang-thai-hoat-dong.xlsx'
        anchor.href = url
        anchor.click()
      })
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
        if (this.isCodeExist(formData.code)) {
          this.message.error(
            `Mã ${formData.code} đã tồn tại, vui lòng nhập lại`
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

  deleteItem(code: string): void {
    this._service.delete(code).subscribe({
      next: (data: any) => {
        this.search();
      },
      error: (response: any) => {
        console.log(response);
      },
    });
  }

  openEdit(data: { code: string; name: string; isActive: boolean }): void {
    this.validateForm.setValue({
      code: data.code,
      name: data.name,
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
