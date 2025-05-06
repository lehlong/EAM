import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseFilter, PaginationResult } from '../../models/base.model';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GlobalService } from '../../service/global.service';
import { ClassDService } from '../../service/master-data/class-d.service';
import { ShareModule } from '../../shared/share-module';
import { CharService } from '../../service/master-data/char.service';
import { ClassHService } from '../../service/master-data/class-h.service';

@Component({
  selector: 'app-class-d',
  imports: [ShareModule],
  templateUrl: './class-d.component.html',
  styleUrl: './class-d.component.scss',
})
export class ClassDComponent implements OnInit, OnDestroy {
  validateForm: FormGroup;
  isSubmit: boolean = false;
  visible: boolean = false;
  edit: boolean = false;
  filter = new BaseFilter();
  paginationResult = new PaginationResult();
  loading: boolean = false;

  lstChar: any[] = [];
  lstClassH: any[] = [];

  constructor(
    private _service: ClassDService,
    private _sChar: CharService,
    private _sClassH: ClassHService,
    private fb: NonNullableFormBuilder,
    private globalService: GlobalService,
    private message: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      id: [''],
      class: ['', [Validators.required]],
      atnam: ['', [Validators.required]],
      aname: [''],
      isActive: [true, [Validators.required]],
    });
    this.globalService.setBreadcrumb([
      {
        name: 'Đặc tính theo nhóm',
        path: 'master-data/class-d',
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
    this.getAllChar();
    this.getAllClassH();

    this.validateForm.get('atnam')?.valueChanges.subscribe((value) => {
      this.onClassChange(value);
    });
  }

  onSortChange(column: string, value: string): void {
    this.filter = {
      ...this.filter,
      //SortColumn: column,
      //IsDescending: value === 'descend',
    };
    this.search();
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

  onClassChange(data: any):void{
    this.validateForm.patchValue({
      aname: this.lstChar.find(x => x.atnam == data)?.atbez,
    });
  }

  getAllChar() {
    this._sChar.getAll().subscribe({
      next: (data) => {
        this.lstChar = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getAllClassH() {
    this._sClassH.getAll().subscribe({
      next: (data) => {
        this.lstClassH = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getClassHName(code: string) {
    return this.lstClassH.find((x) => x.class == code)?.classTxt;
  }

  isCodeExist(classNumber: string): boolean {
    return this.paginationResult.data?.some(
      (item: any) => item.class === classNumber
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
      isActive: true,
    });
    this.isSubmit = false;
  }

  deleteItem(classNumber: string): void {
    this._service.delete(classNumber).subscribe({
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
      class: data.class,
      atnam: data.atnam,
      aname: data.aname,
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
