import { Component, OnInit } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BaseFilter, PaginationResult } from '../../models/base.model';
import { GlobalService } from '../../service/global.service';
import { FlocService } from '../../service/master-data/floc.service';
import { AccountService } from '../../service/system-manager/account.service';
import { NotiService } from '../../service/tran/noti.service';
import { EquipService } from '../../service/master-data/equip.service';
import { WcService } from '../../service/master-data/wc.service';
import { EqGroupService } from '../../service/master-data/eq-group.service';
import { NotiTypeService } from '../../service/master-data/noti-type.service';
import { PlantService } from '../../service/master-data/plant.service';
import { PlgrpService } from '../../service/master-data/plgrp.service';
import { OrganizeService } from '../../service/system-manager/organize.service';
import { NotiAttService } from '../../service/tran/noti-att.service';
import { PriorityLevel } from '../../shared/constants/select.constants';

@Component({
  selector: 'app-incident-approval',
  imports: [ShareModule],
  templateUrl: './incident-approval.component.html',
  styleUrl: './incident-approval.component.scss',
})
export class IncidentApprovalComponent implements OnInit {
  checked: boolean = false;
  visibleDetail: boolean = false;

  filter = new BaseFilter();
  loading: boolean = false;
  paginationResult = new PaginationResult();
  lstFloc: any = [];
  lstUser: any = [];
  lstWc: any[] = [];
  lstEquip: any[] = [];

  lstOrg: any[] = [];
  lstNotiTp: any[] = [];
  lstEqGroup: any[] = [];
  lstEquipSelect: any[] = [];
  lstPlant: any[] = [];
  lstPlgrp: any[] = [];
  lstPriorityLevel = PriorityLevel;

  model: any = {
    arbpl: '',
    qmnum: '',
    tplnr: '',
    eqart: '',
    equnr: '',
    priok: '',
    qmtxt: '',
    qmdetail: '',
    qmart: 'N2',
    iwerk: '',
    qmnam: '',
    ingrp: '',
    staffSc: '',
    ltrmn: new Date(),
    qmdat: new Date(),
    isActive: true,
  };

  constructor(
    private _sNoti: NotiService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private _sFloc: FlocService,
    private _sAccount: AccountService,
    private _sWc: WcService,
    private _sEquip: EquipService,
    private _sPlgrp: PlgrpService,
    private _global: GlobalService,
    private _sUser: AccountService,
    private _sPlant: PlantService,
    private _sEqGroup: EqGroupService,
    private _sNotiTp: NotiTypeService,
    private _sNotiAtt: NotiAttService,
    private _sOrg: OrganizeService
  ) {
    this.globalService.setBreadcrumb([
      {
        name: 'Phê duyệt sự cố',
        path: 'incident/approval',
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
    this.getAllFloc();
    this.getAllUser();
    this.getAllWc();
    this.getAllEquip();
    this.getAllPlgrp();
    this.getAllPlan();
    this.getAllNotiTp();
    this.getEqGroup();
  }
  search() {
    this._sNoti.searchApproval(this.filter).subscribe({
      next: (data) => {
        this.paginationResult = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }
  getAllPlgrp() {
    this._sPlgrp.getAll().subscribe({
      next: (data: any) => {
        this.lstPlgrp = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getAllPlan() {
    this._sPlant.getAll().subscribe({
      next: (data) => (this.lstPlant = data),
      error: (err) => console.log(err),
    });
  }

  getAllOrg() {
    this._sOrg.getOrg().subscribe({
      next: (data: any) => {
        this.lstOrg = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getAllNotiTp() {
    this._sNotiTp.getAll().subscribe({
      next: (data) => {
        this.lstNotiTp = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getEqGroup() {
    this._sEqGroup.getAll().subscribe({
      next: (data) => {
        this.lstEqGroup = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  openDetail(data: any) {
    this.model = data;
    console.log(this.model);
    this.visibleDetail = true;
  }

  closeDetail() {
    this.model = {};
    this.visibleDetail = false;
  }

  updateDetail() {
    this._sNoti.update(this.model).subscribe({
      next: (data) => {
        this.search();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getAllUser() {
    this._sAccount.getListUser().subscribe({
      next: (data) => {
        this.lstUser = data;
      },
    });
  }

  getFullNameUser(username: any) {
    return this.lstUser.find(
      (x: { userName: string }) => x.userName == username
    )?.fullName;
  }

  getAllWc() {
    this._sWc.getAll().subscribe({
      next: (data) => {
        this.lstWc = data;
      },
    });
  }

  getAllEquip() {
    this._sEquip.getAll().subscribe({
      next: (data) => {
        this.lstEquip = data;
      },
    });
  }

  getNameWc(code: any) {
    return this.lstWc.find((x) => x.arbpl == code)?.arbplTxt;
  }

  getNameEquip(code: any) {
    return this.lstEquip.find((x) => x.equnr == code)?.eqktx;
  }

  getAllFloc() {
    this._sFloc.getAll().subscribe({
      next: (data) => {
        this.lstFloc = data;
      },
    });
  }
  getFlocName(code: any) {
    return this.lstFloc.find((x: { tplnr: string }) => x.tplnr == code)
      ?.descript;
  }

  getPriorityText(priok: string): string {
    switch (priok) {
      case '1':
        return 'Rất Cao';
      case '2':
        return 'Cao';
      case '3':
        return 'Trung Bình';
      case '4':
        return 'Thấp';
      case '5':
        return 'Rất Thấp';
      default:
        return priok || '';
    }
  }

  updateStatusNoti(data: any, status: string) {
    data.statAct = status;
    this._sNoti.update(data).subscribe({
      next: () => {
        this.search();
      },
    });
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
