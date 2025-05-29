import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { PaginationResult, BaseFilter } from '../../models/base.model';
import { CatalogService } from '../../service/master-data/catalog.service';
import { GlobalService } from '../../service/global.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CataTypeService } from '../../service/master-data/cata-type.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [ShareModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent implements OnInit, OnDestroy {
  validateForm: FormGroup;
  isSubmit: boolean = false;
  visible: boolean = false;
  edit: boolean = false;
  filter = new BaseFilter();
  paginationResult = new PaginationResult();
  loading: boolean = false;
  lstCataType: any[] = [];

  constructor(
    private _service: CatalogService,
    private _sCataType: CataTypeService,
    private fb: NonNullableFormBuilder,
    public globalService: GlobalService,
    private message: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      id: [''],
      catCode: [''],
      catName: [''],
      catType: [''],
      code: [''],
      codeDes: [''],
      isActive: [true, [Validators.required]],
    });
    this.globalService.setBreadcrumb([
      {
        name: 'Bộ thống kê sự cố',
        path: 'master-data/catalog',
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
    this.getCataType();
  }

  onSortChange(name: string, value: any): void {
    this.filter = {
      ...this.filter,
      // SortColumn: name,
      // IsDescending: value === 'descend',
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
        anchor.download = 'danh-sach-bo-thong-ke-su-co.xlsx'
        anchor.href = url
        anchor.click()
      })
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

  getCataType() {
    this._sCataType.getAll().subscribe({
      next: (data) => {
        this.lstCataType = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getCataTypeName(code: any) {
    return this.lstCataType.find((x) => x.code == code)?.name;
  }

  isCodeExist(catcode: string, code: string): boolean {
    return this.paginationResult.data?.some(
      (catalog: any) => catalog.catcode === catcode && catalog.code === code
    );
  }

  submitForm(): void {
    this.isSubmit = true;
    if (this.validateForm.valid) {
      if (this.edit) {
        this._service.update(this.validateForm.getRawValue()).subscribe({
          next: (data: any) => {
            this.search();
            this.visible = false;
          },
          error: (response: any) => {
            console.log(response);
          },
        });
      } else {
        this._service.create(this.validateForm.getRawValue()).subscribe({
          next: (data: any) => {
            this.search();
            this.visible = false;
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
      isActive: true,
    });
    this.isSubmit = false;
  }

  deleteItem(id: string): void {
    this._service.delete(id).subscribe({
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
      id: data.id,
      catCode: data.catCode,
      catName: data.catName,
      catType: data.catType,
      code: data.code,
      codeDes: data.codeDes || '',
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
