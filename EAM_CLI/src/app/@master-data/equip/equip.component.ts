import { Component } from '@angular/core';
import { BaseFilter, PaginationResult } from '../../models/base.model';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GlobalService } from '../../service/global.service';
import { EquipService } from '../../service/master-data/equip.service';
import { ShareModule } from '../../shared/share-module';
import { PlantService } from '../../service/master-data/plant.service';
import { FlocService } from '../../service/master-data/floc.service';
import { EqCatService } from '../../service/master-data/eq-cat.service';
import { EqGroupService } from '../../service/master-data/eq-group.service';
import { WcService } from '../../service/master-data/wc.service';

@Component({
  selector: 'app-equip',
  imports: [ShareModule],
  templateUrl: './equip.component.html',
  styleUrl: './equip.component.scss',
})
export class EquipComponent {
  validateForm: FormGroup;
  isSubmit: boolean = false;
  visible: boolean = false;
  edit: boolean = false;
  filter = new BaseFilter();
  paginationResult = new PaginationResult();
  lstPlant: any = [];
  lstFloc: any = [];
  lstEqCat: any = [];
  lstEqGroup: any = [];
  lstEquip: any = [];
  lstEqWc: any = [];
  loading: boolean = false;

  constructor(
    private _service: EquipService,
    private _servicePlant: PlantService,
    private _serviceFloc: FlocService,
    private _serviceCat: EqCatService,
    private _serviceWc: WcService,
    private _serviceEqGroup: EqGroupService,
    private fb: NonNullableFormBuilder,
    private globalService: GlobalService,
    private message: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      equnr: ['', [Validators.required]],
      eqktx: [''],
      iwerk: [''],
      datab: [''],
      datbi: [''],
      tplnr: [''],
      ingrp: [''],
      eqtyp: [''],
      eqart: [''],
      eqartSub: [''],
      eqartTp: [''],
      hequi: [''],
      parentFlg: [''],
      childCnt: [0],
      arbpl: [''],
      kostl: [''],
      beber: [''],
      statAct: [''],
      statActT: [''],
      statusTh: [''],
      anlnr: [''],
      anlun: [''],
      klart: [''],
      class: [''],
      auspFlg: [''],
      delFlg: [''],
      delDate: [''],
      inactFlg: [''],
      inactDate: [''],
      inbdt: [''],
      isActive: [true, [Validators.required]],
    });
    this.globalService.setBreadcrumb([
      {
        name: 'Thiết bị',
        path: 'master-data/equip',
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
    this.getEqGroup();
    this.searchFlant();
    this.searchFloc();
    this.searchCat();
    this.getAllEquip();
    this.getEqWc();
  }

  onSortChange(tplnrTxt: string, value: any) {
    this.filter = {
      ...this.filter,
      //SortColumn: tplnrTxt,
      //IsDescending: value === 'descend',
    };
    this.search();
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

  getAllEquip() {
    this.isSubmit = false;
    this._service.getAll().subscribe({
      next: (data) => {
        this.lstEquip = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  searchFlant() {
    this.isSubmit = false;
    this._servicePlant.getAll().subscribe({
      next: (data) => {
        this.lstPlant = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }
  searchFloc() {
    this.isSubmit = false;
    this._serviceFloc.getAll().subscribe({
      next: (data) => {
        this.lstFloc = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }
  searchCat() {
    this.isSubmit = false;
    this._serviceCat.getAll().subscribe({
      next: (data) => {
        this.lstEqCat = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  getEqGroup() {
    this.isSubmit = false;
    this._serviceEqGroup.getAll().subscribe({
      next: (data) => {
        this.lstEqGroup = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  getEqWc() {
    this.isSubmit = false;
    this._serviceWc.getAll().subscribe({
      next: (data) => {
        this.lstEqWc = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  setValueCat(code: any) {
    const category = this.lstEqCat.find(
      (cat: { eqtyp: any }) => cat.eqtyp === code
    );
    this.validateForm.get('ingrp')?.setValue(category.name);
  }

  isCodeExist(tplnr: string): boolean {
    return this.paginationResult.data?.some(
      (accType: any) => accType.tplnr === tplnr
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
        if (this.isCodeExist(formData.tplnr)) {
          this.message.error(
            `Mã ${formData.tplnr} đã tồn tại, vui lòng nhập lại`
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

  deleteItem(tplnr: string) {
    this._service.delete(tplnr).subscribe({
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
      iwerk: data.iwerk,
      equnr: data.equnr,
      eqktx: data.eqktx,
      datab: data.datab,
      datbi: data.datbi,
      tplnr: data.tplnr,
      ingrp: data.ingrp,
      eqtyp: data.eqtyp,
      eqart: data.eqart,
      eqartSub: data.eqartSub,
      eqartTp: data.eqartTp,
      hequi: data.hequi,
      parentFlg: data.parentFlg,
      childCnt: data.childCnt,
      arbpl: data.arbpl,
      kostl: data.kostl,
      beber: data.beber,
      statAct: data.statAct,
      statActT: data.statActT,
      statusTh: data.statusTh,
      anlnr: data.anlnr,
      anlun: data.anlun,
      klart: data.klart,
      class: data.class,
      auspFlg: data.auspFlg,
      delFlg: data.delFlg,
      delDate: data.delDate,
      inactFlg: data.inactFlg,
      inactDate: data.inactDate,
      inbdt: data.inbdt,
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
