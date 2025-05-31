import { Component } from '@angular/core';
import { BaseFilter, PaginationResult } from '../../models/base.model';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GlobalService } from '../../service/global.service';
import { EqCounterService } from '../../service/master-data/equip-counter.service';
import { ShareModule } from '../../shared/share-module';
import { mptyp } from '../../shared/constants/select.constants';
import { DropdownService } from '../../service/dropdown/dropdown.service';

@Component({
  selector: 'app-equip-counter',
  imports: [ShareModule],
  templateUrl: './equip-counter.component.html',
  styleUrl: './equip-counter.component.scss'
})
export class EquipCounterComponent {
  validateForm: FormGroup;
  isSubmit: boolean = false;
  visible: boolean = false;
  edit: boolean = false;
  filter = new BaseFilter();
  paginationResult = new PaginationResult();
  loading: boolean = false;
  lstMptyp = mptyp;
  lstUnit: any = [];
  lstEquip: any = [];

  constructor(
    private _service: EqCounterService,
    private fb: NonNullableFormBuilder,
    public globalService: GlobalService,
    private message: NzMessageService,
    private dropdownService: DropdownService
  ) {
    this.validateForm = this.fb.group({
      point: ['', [Validators.required]],
      equnr: ['', [Validators.required]],
      pttxt: [''],
      mptyp: [''],
      dvt: [''],
      maxCount: 0,
      yearCount: 0,
      isActive: [true, [Validators.required]],
    });
    this.globalService.setBreadcrumb([
      {
        name: 'Bộ đếm thiết bị',
        path: 'master-data/eq-counter',
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
    this.getallUnit();
    this.getAllEquip();
  }

  onSortChange(eqtypTxt: string, value: any) {
    this.filter = {
      ...this.filter,
      //SortColumn: eqtypTxt,
      //IsDescending: value === 'descend',
    };
    this.search();
  }
  getallUnit() {
    this.dropdownService.getAllUnit().subscribe({
      next: (data) => {
        this.lstUnit = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }
  getAllEquip() {
    this.dropdownService.getAllEquip().subscribe({
      next: (data) => {
        this.lstEquip = data;
      },
      error: (response) => {
        console.log(response);
      },
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
  exportExcel() {
    return this._service
      .exportExcel(this.filter)
      .subscribe((result: Blob) => {
        const blob = new Blob([result], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        const url = window.URL.createObjectURL(blob)
        var anchor = document.createElement('a')
        anchor.download = 'danh-sach-bo-dem.xlsx'
        anchor.href = url
        anchor.click()
      })
  }
  isCodeExist(eqtyp: string): boolean {
    return this.paginationResult.data?.some(
      (accType: any) => accType.eqtyp === eqtyp
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
        if (this.isCodeExist(formData.eqtyp)) {
          this.message.error(
            `Mã ${formData.point} đã tồn tại, vui lòng nhập lại`
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

  deleteItem(eqtyp: string) {
    this._service.delete(eqtyp).subscribe({
      next: (data) => {
        this.search();
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  openEdit(data: {
    point: string; equnr: string; pttxt: string;
    mptyp: string;
    dvt: string;
    maxCount: number;
    yearCount: number; isActive: boolean
  }) {
    this.validateForm.setValue({
      point: data.point,
      equnr: data.equnr,
      pttxt: data.pttxt,
      mptyp: data.mptyp,
      dvt: data.dvt,
      maxCount: data.maxCount,
      yearCount: data.yearCount,
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

