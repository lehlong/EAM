import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BaseFilter, PaginationResult } from '../../models/base.model';
import { DropdownService } from '../../service/dropdown/dropdown.service';
import { GlobalService } from '../../service/global.service';
import { EqCounterService } from '../../service/master-data/equip-counter.service';
import { mptyp } from '../../shared/constants/select.constants';
import { ShareModule } from '../../shared/share-module';
import { TranEqCounterService } from '../../service/tran/tran-eq-counter.service';

@Component({
  selector: 'app-tran-eq-counter',
  imports: [ShareModule],
  templateUrl: './tran-eq-counter.component.html',
  styleUrl: './tran-eq-counter.component.scss'
})
export class TranEqCounterComponent {
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
  lstEqCounter: any[] = []

  model: any = {
    mdocm: 'A',
    point: '',
    equnr: '',
    iDate: '',
    reading: 0,
    dvt: '',
    difValue: 0,
    readText: '',
    isActive: true
  }

  constructor(
    private _service: EqCounterService,
    private fb: NonNullableFormBuilder,
    public globalService: GlobalService,
    private message: NzMessageService,
    private dropdownService: DropdownService,
    private _sTranCounter: TranEqCounterService
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
    this.getallUnit();
    this.getAllEquip();
  }

  searchTranCounter() {
this._sTranCounter.search(this.filter).subscribe({
      next: (data) => {
        this.paginationResult = data
      },
      error: (e) => {
        console.log(e)
      }
    })
  }
  onChangeEquip(e: any) {
    this.filter.equnr = e;
    this._service.search(this.filter).subscribe({
      next: (data) => {
        this.lstEqCounter = data.data;
        if (this.lstEqCounter.length == 0) {
          this.message.error('Không có bộ đếm nào cho thiết bị này!')
        }
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  onCreateCounter() {
    const validations = [
      { value: this.model.equnr, message: 'Vui lòng chọn thiết bị' },
      { value: this.model.point, message: 'Vui lòng chọn bộ đếm' },
      { value: this.model.iDate, message: 'Vui lòng chọn ngày đo' },
      { value: this.model.reading, message: 'Vui lòng nhập chỉ số hoạt động' },
    ];

    for (const { value, message } of validations) {
      if (!this.globalService.validateRequired(value, message)) {
        return;
      }
    }
    this._sTranCounter.create(this.model).subscribe({
      next: (data) => {
        this.searchTranCounter();
      },
      error: (err) => {
        console.log(err)
      }
    })
  }


  onChangePoint(e: any) {
    this.filter.point = e;
    this._sTranCounter.search(this.filter).subscribe({
      next: (data) => {
        this.paginationResult = data
      },
      error: (e) => {
        console.log(e)
      }
    })
  }
  onSortChange(eqtypTxt: string, value: any) {
    this.filter = {
      ...this.filter,
      //SortColumn: eqtypTxt,
      //IsDescending: value === 'descend',
    };
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
  

  close() {
    this.visible = false;
    this.resetForm();
  }

  reset() {
    this.filter = new BaseFilter();
  }

  openCreate() {
    this.edit = false;
    this.visible = true;
  }

  resetForm() {
    this.validateForm.reset();
    this.isSubmit = false;
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
    this.searchTranCounter();
  }

  pageIndexChange(index: number): void {
    this.filter.currentPage = index;
    this.searchTranCounter();
  }
}

