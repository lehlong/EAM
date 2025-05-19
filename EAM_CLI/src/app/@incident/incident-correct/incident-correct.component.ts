import { Component, OnInit } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BaseFilter, PaginationResult } from '../../models/base.model';
import { GlobalService } from '../../service/global.service';
import { EqGroupService } from '../../service/master-data/eq-group.service';
import { EquipService } from '../../service/master-data/equip.service';
import { FlocService } from '../../service/master-data/floc.service';
import { NotiTypeService } from '../../service/master-data/noti-type.service';
import { OrderTypeService } from '../../service/master-data/order-type.service';
import { PlantService } from '../../service/master-data/plant.service';
import { PlgrpService } from '../../service/master-data/plgrp.service';
import { WcService } from '../../service/master-data/wc.service';
import { AccountService } from '../../service/system-manager/account.service';
import { NotiService } from '../../service/tran/noti.service';
import { OrderService } from '../../service/tran/order.service';
import { HTBTBD, ILART, LVTSD, PriorityLevel } from '../../shared/constants/select.constants';
import { NotiCatalogService } from '../../service/tran/not-catalog.service';
import { CatalogService } from '../../service/master-data/catalog.service';

@Component({
  selector: 'app-incident-correct',
  imports: [ShareModule],
  templateUrl: './incident-correct.component.html',
  styleUrl: './incident-correct.component.scss',
})
export class IncidentCorrectComponent implements OnInit {
  checked: boolean = false;
  filter = new BaseFilter();
  loading: boolean = false;
  paginationResult = new PaginationResult();
  lstFloc: any = [];
  lstUser: any = [];
  lstWc: any[] = [];
  lstEquip: any[] = [];
  lstEqGroup: any[] = [];
  lstPlgrp: any[] = [];
  lstPlant: any[] = [];
  lstPriorityLevel = PriorityLevel;
  lstNotiTp: any[] = [];
  lstOrderType: any[] = [];
  lstHTBTBD = HTBTBD;
  lstLVTSD = LVTSD;
  lstILART = ILART;

   lstNotiCatalog: any[] = [];
  lstCatalogTypeA: any[] = [];
  lstCatalogTypeB: any[] = [];
  lstCatalogTypeC: any[] = [];
  lstCatalogType2: any[] = [];
  lstCatalogType5: any[] = [];

  model: any =  {
    iwerk: '',
    aufnr: '',
    auart: '',
    ktext: '',
    ilart: '',
    artpr: '',
    priok: '',
    equnr: '',
    tplnr: '',
    oblty: '',
    eqart: '',
    eqartError: '',
    ingpr: '',
    warpl: '',
    abnum: null,
    nplda: null,
    addat: null,
    qmnum: '',
    obknr: null,
    gewrk: '',
    eqartSub: '',
    objnr: '',
    aufpl: '',
    rsnum: '',
    accFlg: '',
    ftrms: null,
    gstri: null,
    gltri: null,
    gstrp: null,
    gltrp: null,
    gstrs: null,
    gltrs: null,
    getri: null,
    ftrmi: null,
    ftrmp: null,
    bukrs: '',
    arbpl: '',
    werks: '',
    kostv: '',
    stort: '',
    iphas: '',
    phas0: '',
    phas1: '',
    phas2: '',
    phas3: '',
    pdat1: null,
    pdat2: null,
    pdat3: null,
    idat3: null,
    htBtbd: '',
    staffPl: '',
    staff: '',
    loaivtSd: '',
    staffSc: '',
    staffKt: '',
    ausvn: null,
    ausbs: null,
    lockFlg: '',
    lockDate: null,
    delFlg: '',
    delDate: null,
    status: '',
    stat: '',
    statT: '',
    lifnr: '',
    budat: null,
    bldat: null,
    hkont: '',
    dmbtr: null,
    waers: '',
    rootF: '',
    statMo: '',
    statTd: '',
    statKt: '',
    cfFlg: '',
    kqFlg: '',
    groupidPm: '',
    pmvtid: '',
    ernam: '',
    erdat: null,
    aenam: '',
    aedat: null,
    needup: '',
    belnr: '',
    gjahr: null,
    equipName: '',
    flocName: '',
  };

  constructor(
    private _sNotiCatalog : NotiCatalogService,
    private _sOrder: OrderService,
    private _sOrderType: OrderTypeService,
    private _sNotiTp: NotiTypeService,
    private _sPlant: PlantService,
    private _sCatalog: CatalogService,
    private _sNoti: NotiService,
    private _sWc: WcService,
    private _sEquip: EquipService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private _sFloc: FlocService,
    private _sAccount: AccountService,
    private _sEqGroup: EqGroupService,
    private _sPlgrp: PlgrpService
  ) {
    this.globalService.setBreadcrumb([
      {
        name: 'Danh sách lệnh',
        path: 'incident/correct',
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
    this.getMasterData();
  }
  search() {
    this._sOrder.search(this.filter).subscribe({
      next: (data) => {
        this.paginationResult = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  addCatalogItem() {
     this.lstNotiCatalog = [...this.lstNotiCatalog, {
      id: 'A',
      qmnum: this.model.qmnum,
      objpart: null,
      typeCode: null,
      typeTxt: null,
      causeCode: null,
      causeTxt: null,
      taskCode: null,
      taskTxt: null,
      actCode: null,
      actTxt: null,
      creatBy: null,
      createOn: null,
      changeBy: null,
      changeOn: null,
      isActive: true,
    },];
  }

  getMasterData() {
    this._sPlant.getAll().subscribe({
      next: (data) => {
        this.lstPlant = data;
      },
    });
    this._sOrderType.getAll().subscribe({
      next: (data) => {
        this.lstOrderType = data;
      },
    });
    this._sNotiTp.getAll().subscribe({
      next: (data) => {
        this.lstNotiTp = data;
      },
    });
    this._sPlgrp.getAll().subscribe({
      next: (data) => {
        this.lstPlgrp = data;
      },
    });
    this._sEqGroup.getAll().subscribe({
      next: (data) => {
        this.lstEqGroup = data;
      },
    });
    this._sAccount.getListUser().subscribe({
      next: (data) => {
        this.lstUser = data;
      },
    });
    this._sWc.getAll().subscribe({
      next: (data) => {
        this.lstWc = data;
      },
    });
    this._sEquip.getAll().subscribe({
      next: (data) => {
        this.lstEquip = data;
      },
    });
    this._sFloc.getAll().subscribe({
      next: (data) => {
        this.lstFloc = data;
      },
    });

    this._sCatalog.getAll().subscribe({
      next: (data: any) => {
        this.lstCatalogTypeA = data.filter(
          (x: { catType: string }) => x.catType === 'A'
        );
        this.lstCatalogTypeB = data.filter(
          (x: { catType: string }) => x.catType === 'B'
        );
        this.lstCatalogTypeC = data.filter(
          (x: { catType: string }) => x.catType === 'C'
        );
        this.lstCatalogType2 = data.filter(
          (x: { catType: string }) => x.catType === '2'
        );
        this.lstCatalogType5 = data.filter(
          (x: { catType: string }) => x.catType === '5'
        );
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  visibleOrder: boolean = false;
  openEditOrder(data: any) {
    this.model = data;
    this.model.equipName = this.getNameEquip(data.equnr);
    this.model.flocName = this.getFlocName(data.tplnr);
    this._sNotiCatalog.getByQmnum(data.qmnum).subscribe({
      next: (data) => {
        this.lstNotiCatalog = data;
      },
      error: (err) => {},
    });
    this.visibleOrder = true;
    console.log(this.model);
  }
  closeOrder() {
    this.visibleOrder = false;
  }
  updateOrder() {
    this._sOrder.update(this.model).subscribe({
      next: (data) => {
        this.search();
      },
      error: (err) => {
        console.log(err);
      },
    });

    this._sNotiCatalog.update(this.lstNotiCatalog).subscribe({
      next: () => {
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getFullNameUser(username: any) {
    return this.globalService.getFullNameUser(this.lstUser, username);
  }
  getNameWc(code: any) {
    return this.globalService.getNameWc(this.lstWc, code);
  }

  getNameEquip(code: any) {
    return this.globalService.getNameEquip(this.lstEquip, code);
  }

  getFlocName(code: any) {
    return this.globalService.getNameFloc(this.lstFloc, code);
  }

  getPriorityText(priok: string) {
    return this.globalService.getPriorityText(priok);
  }
  reset() {
    this.filter = new BaseFilter();
    this.search();
  }

  pageIndexChange(page: number): void {
    this.filter.currentPage = page;
    this.search();
  }

  pageSizeChange(size: number): void {
    this.filter.pageSize = size;
    this.filter.currentPage = 1;
    this.search();
  }
}
