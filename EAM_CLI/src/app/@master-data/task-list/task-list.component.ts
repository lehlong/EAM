import { Component } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BaseFilter, PaginationResult } from '../../models/base.model';
import { GlobalService } from '../../service/global.service';
import { TasklistService } from '../../service/master-data/task-list.service';

@Component({
  selector: 'app-task-list',
  imports: [ShareModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TasklistComponent {
  validateForm: FormGroup;
  isSubmit: boolean = false;
  visible: boolean = false;
  edit: boolean = false;
  filter = new BaseFilter();
  paginationResult = new PaginationResult();
  loading: boolean = false;

  constructor(
    private _service: TasklistService,
    private fb: NonNullableFormBuilder,
    public globalService: GlobalService,
    private message: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      id:[''],
      plnnr: [''],
      ktext: [''],
      vornr: [''],
      ltxa1: [''],
      isActive: [true, [Validators.required]],
    });
    this.globalService.setBreadcrumb([
      {
        name: 'Tasklist',
        path: 'master-data/task-list',
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
  }

  onSortChange(dataTxt: string, value: any) {
    this.filter = {
      ...this.filter,
      //SortColumn: dataTxt,
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
        anchor.download = 'danh-sach-task-list.xlsx'
        anchor.href = url
        anchor.click()
      })
  }
  search() {
    this.isSubmit = false;
    this._service.search(this.filter).subscribe({
      next: (data) => {
        this.paginationResult = data;
        console.log(data)
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  isCodeExist(data: string): boolean {
    return this.paginationResult.data?.some(
      (accType: any) => accType.data === data
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

  deleteItem(data: string) {
    this._service.delete(data).subscribe({
      next: (data) => {
        this.search();
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  openEdit(data: any) {
    this.validateForm.setValue({
      id: data.id,
      plnnr: data.plnnr,
      ktext: data.ktext,
      vornr: data.vornr,
      ltxa1: data.ltxa1,
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

