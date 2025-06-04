import { Component } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { Observable, Observer, Subscription } from 'rxjs';
import { EquipFilter } from '../../filter/master-data/equiq-filter';
import { BaseFilter, PaginationResult } from '../../models/base.model';
import { EquipClassModel } from '../../models/master-data/equip-class.model';
import { CommonService } from '../../service/common.service';
import { GlobalService } from '../../service/global.service';
import { ActiveStatusService } from '../../service/master-data/active-status.service';
import { ClassDService } from '../../service/master-data/class-d.service';
import { ClassHService } from '../../service/master-data/class-h.service';
import { EqCatService } from '../../service/master-data/eq-cat.service';
import { EqGroupService } from '../../service/master-data/eq-group.service';
import { EquipDocService } from '../../service/master-data/equip-doc.service';
import { EquipPicService } from '../../service/master-data/equip-pic.service';
import { EquipService } from '../../service/master-data/equip.service';
import { EquipCharService } from '../../service/master-data/equiq-char.service';
import { FlocService } from '../../service/master-data/floc.service';
import { PlantService } from '../../service/master-data/plant.service';
import { UsageStatusService } from '../../service/master-data/usage-status.service';
import { WcService } from '../../service/master-data/wc.service';
import { AccountService } from '../../service/system-manager/account.service';
import { NotiFilter } from '../../filter/incident/incident.filter';
import { NotiService } from '../../service/tran/noti.service';
import { OrderService } from '../../service/tran/order.service';

@Component({
  selector: 'app-equip-history',
  imports: [ShareModule],
  standalone: true,
  templateUrl: './equip-history.component.html',
  styleUrl: './equip-history.component.scss',
})
export class EquipHistoryComponent {
  validateForm: FormGroup;
  isSubmit: boolean = false;
  visible: boolean = false;
  edit: boolean = false;
  filter = new EquipFilter();
  exportFilter = new BaseFilter();

  filterNoti = new NotiFilter();
  filterOrder = new NotiFilter();
  paginationResult = new PaginationResult();
  paginationResultNoti = new PaginationResult();
  paginationResultOrder = new PaginationResult();
  lstPlant: any = [];
  lstFloc: any = [];
  lstEqCat: any = [];
  lstEqGroup: any = [];
  lstEquip: any = [];
  lstEqWc: any = [];
  lstOrganize: any = [];
  lstUsageStatus: any = [];
  lstActiveStatus: any = [];
  lstAccount: any = [];
  lstEqChar: any = [];
  loading: boolean = false;

  environment = environment;

  equipDocuments: any[] = [];
  equipPictures: any[] = [];
  uploadingDoc: boolean = false;
  uploadingPic: boolean = false;
  previewImage: string | undefined = '';
  previewVisible: boolean = false;
  docFileList: NzUploadFile[] = [];
  picFileList: NzUploadFile[] = [];
  currentEquipCode: string = '';
  selectedDocType: string = '';
  lstClassH: any[] = [];
  lstClassD: any[] = [];
  lstClassDSelect: any[] = [];

  constructor(
    private _sAccount: AccountService,
    private _sUsageStatus: UsageStatusService,
    private _sActiveStatus: ActiveStatusService,
    private _service: EquipService,
    private _servicePlant: PlantService,
    private _serviceFloc: FlocService,
    private _serviceCat: EqCatService,
    private _serviceWc: WcService,
    private _serviceEqGroup: EqGroupService,
    private _serviceEquipDoc: EquipDocService,
    private _serviceEquipPic: EquipPicService,
    private fb: NonNullableFormBuilder,
    public _global: GlobalService,
    private message: NzMessageService,
    private commonService: CommonService,
    private _sEqChar: EquipCharService,
    private router: Router,
    private classH: ClassHService,
    private classD: ClassDService,
    private _sNoti: NotiService,
    private _sOrder: OrderService,
    private route: ActivatedRoute,
  ) {
    this.validateForm = this.fb.group({
      equnr: ['', [Validators.required]],
      eqktx: [''],
      iwerk: [''],
      tplnr: [''],
      ingrp: [''],
      eqtyp: [''],
      eqart: [''],
      eqartSub: [''],
      hequi: [''],
      arbpl: [''],
      statAct: [''],
      statusTh: [''],
      anlnr: [''],
      anlun: [''],
      class: [''],
      inbdt: [null],
      isActive: [true, [Validators.required]],
    });

    this._global.setBreadcrumb([
      {
        name: 'Lý lịch thiết bị',
        path: 'master-data/equip-history',
      },
    ]);
    this._global.getLoading().subscribe((value) => {
      this.loading = value;
    });
  }
  ngOnDestroy() {
    this._global.setBreadcrumb([]);
  }

  ngOnInit(): void {
    this.search();
    this.getMasterData();
 this.route.paramMap.subscribe({
      next: (params) => {
        const equnr = params.get('equnr');
        if (equnr != '0') {
          this._service.getById(equnr).subscribe({
            next: (data) => {
              if(data != null) this.openEdit(data)
            }
          })
        }
      },
    });

  }

  getMasterData() {
    this._sAccount.getListUser().subscribe((r) => (this.lstAccount = r));
    this._sUsageStatus.getAll().subscribe((r) => (this.lstUsageStatus = r));
    this._sActiveStatus.getAll().subscribe((r) => (this.lstActiveStatus = r));
    this._service.getAll().subscribe((r) => (this.lstEquip = r));
    this._servicePlant.getAll().subscribe((r) => (this.lstPlant = r));
    this._serviceFloc.getAll().subscribe((r) => (this.lstFloc = r));
    this._serviceCat.getAll().subscribe((r) => (this.lstEqCat = r));
    this._serviceEqGroup.getAll().subscribe((r) => (this.lstEqGroup = r));
    this._serviceWc.getAll().subscribe((r) => (this.lstEqWc = r));
    this.classD.getAll().subscribe((r) => {
      this.lstClassD = r;
      this.lstClassDSelect = r;
    });
    this.classH.getAll().subscribe((r) => (this.lstClassH = r));
  }

  onSortChange(tplnrTxt: string, value: any) {
    this.filter = {
      ...this.filter,
      //SortColumn: tplnrTxt,
      //IsDescending: value === 'descend',
    };
    this.search();
  }
  exportExcel() {
    return this._service
      .exportExcel(this.exportFilter)
      .subscribe((result: Blob) => {
        const blob = new Blob([result], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        var anchor = document.createElement('a');
        anchor.download = 'danh-sach-thiet-bi.xlsx';
        anchor.href = url;
        anchor.click();
      });
  }
  addEqChar() {
    const eClass = new EquipClassModel();
    eClass.equnr = this.currentEquipCode;
    this.lstEqChar = [...this.lstEqChar, eClass];
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

  onChangeClassH(e: any) {
    this.lstClassDSelect = this.lstClassD.filter((x) => x.class == e);
  }

  getNameEquart(code: string) {
    return this.lstEqGroup.find((x: { eqart: string }) => x.eqart == code)
      ?.eqartTxt;
  }

  getNameFloc(code: string) {
    return this.lstFloc.find((x: { tplnr: string }) => x.tplnr == code)
      ?.descript;
  }

  getEquipmentCategoryName(code: string) {
    return this.lstEqCat.find((x: { eqtyp: string }) => x.eqtyp == code)
      ?.eqtypTxt;
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

  close() {
    this.visible = false;
    this.selectedDocType = '';
    this.equipDocuments = [];
    this.equipPictures = [];
    this.currentEquipCode = '';
    this.lstEqChar = [];
    this.resetForm();
  }

  reset() {
    this.filter = new BaseFilter();
    this.search();
  }

  resetForm() {
    this.validateForm.reset();
    this.isSubmit = false;
  }

  openEdit(data: any) {
    this.validateForm.patchValue(data);
    this._sEqChar.getDetail(data.equnr).subscribe({
      next: (data) => {
        this.lstEqChar = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
    this.filterNoti.equnr = data.equnr;
    this._sNoti.search(this.filterNoti).subscribe({
      next: (data) => (this.paginationResultNoti = data),
      error: (err) => console.log(err),
    });
    this._sOrder.search(this.filterNoti).subscribe({
      next: (data) => {
        this.paginationResultOrder = data;
      },
      error: (response) => {
        console.log(response);
      },
    });

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
