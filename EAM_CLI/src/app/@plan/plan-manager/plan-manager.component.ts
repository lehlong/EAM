import { PlanHService } from './../../service/plan/plan-h.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BaseFilter, PaginationResult } from '../../models/base.model';
import { GlobalService } from '../../service/global.service';
import { ShareModule } from '../../shared/share-module';
import { CYCTYPE, CYCUNIT, MPGRP } from '../../shared/constants/select.constants';
import { FlocService } from '../../service/master-data/floc.service';
import { PlgrpService } from '../../service/master-data/plgrp.service';
import { OrderTypeService } from '../../service/master-data/order-type.service';
import { WcService } from '../../service/master-data/wc.service';
import { TasklistService } from '../../service/master-data/task-list.service';
import { EqGroupService } from '../../service/master-data/eq-group.service';
import { EquipService } from '../../service/master-data/equip.service';
import { EqCounterService } from '../../service/master-data/equip-counter.service';

@Component({
  selector: 'app-plan-manager',
  imports: [ShareModule],
  templateUrl: './plan-manager.component.html',
  styleUrl: './plan-manager.component.scss',
})
export class PlanManagerComponent implements OnInit, OnDestroy {
  validateForm: FormGroup;
  isSubmit: boolean = false;
  visible: boolean = false;
  edit: boolean = false;
  filter = new BaseFilter();
  paginationResult = new PaginationResult();
  loading: boolean = false;
  lstMpgrp = MPGRP;
  lstFloc: any[] = [];
  lstPlgrp: any[] = [];
  lstOrderType: any[] = [];
  lstWc: any[] = [];
  lstCyctype = CYCTYPE;
  lstCycunit = CYCUNIT;
  lstTasklist: any[] = [];
  lstChecklist: any[] = [];
  lstTask: any[] = [];
  lstEqGroup: any[] = [];
  lstEquip: any[] = [];
  lstEqCounter : any = [];

  model: any = {
    iwerk: null,
    warpl: null,
    wptxt: null,
    mptyp: '1',
    mpgrp: null,
    cyctype: null,
    cycunit: null,
    cycle: null,
    cycef: null,
    stdate: null,
    measure: null,
    measvalue: 0,
    mix: null,
    tplnr: null,
    equnr: null,
    plnnr: null,
    ingrp: null,
    arbpl: null,
    auart: null,
    isActive: true,
    lstEquip: [],
    lstPlanOrder: [],
  };

  constructor(
    private _service: PlanHService,
    private fb: NonNullableFormBuilder,
    public globalService: GlobalService,
    private message: NzMessageService,
    private flocService: FlocService,
    private plgrp : PlgrpService,
    private orderType: OrderTypeService,
    private wc : WcService,
    private _sTasklist: TasklistService,
    private _sEqGroup: EqGroupService,
    private equip: EquipService,
    private _sEqCounter : EqCounterService
  ) {
    this.validateForm = this.fb.group({
      warpl: ['', [Validators.required]],
      wptxt: ['', [Validators.required]],
      isActive: [true, [Validators.required]],
    });
    this.globalService.setBreadcrumb([
      {
        name: 'Danh sách kế hoạch',
        path: 'plan/manager',
      },
    ]);
    this.globalService.getLoading().subscribe((value: boolean) => {
      this.loading = value;
    });
  }

  getMasterData() {
    this.flocService.getAll().subscribe({
      next: (data: any) => {
        this.lstFloc = data;
      },
      error: (response: any) => {
        console.log(response);
      },
    });
    this.plgrp.getAll().subscribe({
      next: (data: any) => {
        this.lstPlgrp = data;
      },
      error: (response: any) => {
        console.log(response);
      },
    });
    this.orderType.getAll().subscribe({
      next: (data: any) => {
        this.lstOrderType = data;
      },
      error: (response: any) => {
        console.log(response);
      },
    });
     this._sEqCounter.getAll().subscribe({
      next: (data: any) => {
        this.lstEqCounter = data;
      },
      error: (response: any) => {
        console.log(response);
      },
    });
    this.wc.getAll().subscribe({
      next: (data: any) => {
        this.lstWc = data;
      },
      error: (response: any) => {
        console.log(response);
      },
    });

    this._sEqGroup.getAll().subscribe({
      next: (data: any) => {
        this.lstEqGroup = data;
      },
      error: (response: any) => {}
    });
    this.equip.getAll().subscribe({
      next: (data: any) => {
        this.lstEquip = data;
      },
      error: (response: any) => {
        console.log(response);
      },
    });

    this.getAllTasklist();
  }

  getAllTasklist() {
    this._sTasklist.getAll().subscribe({
      next: (data) => {
        this.lstTasklist = data;
        this.lstChecklist = this.getUniqueByPlnnrAndKtext(data);
      },
    });
  }

  getUniqueByPlnnrAndKtext(items: any[]): any[] {
    const map = new Map<string, any>();
    items.forEach((item) => {
      const key = `${item.plnnr}-${item.ktext}`;
      if (!map.has(key)) {
        map.set(key, { plnnr: item.plnnr, ktext: item.ktext });
      }
    });
    return Array.from(map.values());
  }

  getNameEquip(code: string) {
    return this.globalService.getNameEquip(this.lstEquip, code);
  }

  getNameEqGroup(code: string) {
    return this.globalService.getNameEqGroup(this.lstEqGroup, code);
  }

  getNameWc(code: string) {
    return this.globalService.getNameWc(this.lstWc, code);
  }

  getNameOrderType(code: string) {
    return this.globalService.getNameOrderType(this.lstOrderType, code);
  }

  getNameFloc(code: string) {
    return this.globalService.getNameFloc(this.lstFloc, code);
  }

  getNamePlgrp(code: string) {
    return this.globalService.getNamePlgrp(this.lstPlgrp, code);
  }

  getNameMpgrp(code: string): string {
    const item = this.lstMpgrp.find((item) => item.value === code);
    return item ? item.name : '';
  }

  ngOnDestroy(): void {
    this.globalService.setBreadcrumb([]);
  }

  ngOnInit(): void {
    this.search();
    this.getMasterData();
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
      (PlanH: any) => PlanH.code === code
    );
  }
  exportExcel() {
    return this._service.exportExcel(this.filter).subscribe((result: Blob) => {
      const blob = new Blob([result], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      var anchor = document.createElement('a');
      anchor.download = 'danh-sach-ke-hoach.xlsx';
      anchor.href = url;
      anchor.click();
    });
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
      isActive: true,
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

  openEdit(data: any): void {
   this.edit = true;
   this.model = data;
    this.lstTask = this.lstTasklist
      .filter((x) => x.plnnr == this.model.plnnr)
      .sort((a, b) => a.vornr.localeCompare(b.vornr));
   this.visible = true;

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

