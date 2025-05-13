import { Component, OnInit } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { BaseFilter, PaginationResult } from '../../models/base.model';
import { GlobalService } from '../../service/global.service';
import { NotiService } from '../../service/tran/noti.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FlocService } from '../../service/master-data/floc.service';
import { AccountService } from '../../service/system-manager/account.service';
import { WcService } from '../../service/master-data/wc.service';
import { EquipService } from '../../service/master-data/equip.service';
import { EqGroupService } from '../../service/master-data/eq-group.service';
import { PlgrpService } from '../../service/master-data/plgrp.service';
import { PlantService } from '../../service/master-data/plant.service';
import { PriorityLevel } from '../../shared/constants/select.constants';
import { NotiTypeService } from '../../service/master-data/noti-type.service';
import { OrderTypeService } from '../../service/master-data/order-type.service';

@Component({
  selector: 'app-incident-list',
  imports: [ShareModule],
  templateUrl: './incident-list.component.html',
  styleUrl: './incident-list.component.scss',
})
export class IncidentListComponent implements OnInit {
  checked: boolean = false;
  filter = new BaseFilter();
  loading: boolean = false;
  paginationResult = new PaginationResult();
  lstFloc: any = [];
  lstUser: any = [];
  lstWc : any[] = [];
  lstEquip : any[] = [];
  lstEqGroup : any[] = [];
  lstPlgrp : any[] = []
  lstPlant: any[] = []
  lstPriorityLevel = PriorityLevel;
  lstNotiTp : any[] = []
  lstOrderType : any[] = []

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
    private _sOrderType: OrderTypeService,
    private _sNotiTp: NotiTypeService,
    private _sPlant: PlantService,
    private _sNoti: NotiService,
    private _sWc : WcService,
    private _sEquip : EquipService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private _sFloc: FlocService,
    private _sAccount: AccountService,
    private _sEqGroup : EqGroupService,
    private _sPlgrp : PlgrpService,
  ) {
    this.globalService.setBreadcrumb([
      {
        name: 'Danh sách sự cố',
        path: 'incident/list',
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
    this.getAllEgGroup();
    this.getAllPlgrp();
    this.getAllPlant();
    this.getAllNotiTp();
    this.getAllOrderType();
  }
  search() {
    this._sNoti.search(this.filter).subscribe({
      next: (data) => {
        this.paginationResult = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

visibleOrder: boolean= false;
  openAddOrder(data : any){
    this.model = data
    this.model.auart = 'PM02';
    this.visibleOrder = true
  }
  closeOrder(){
    this.visibleOrder = false;
  }
  createOrder(){

  }

   getAllPlant(){
    this._sPlant.getAll().subscribe({
      next:(data) => {
        this.lstPlant = data
      }
    })
  }

  getAllOrderType(){
    this._sOrderType.getAll().subscribe({
      next:(data) => {
        this.lstOrderType = data
      }
    })
  }

   getAllNotiTp(){
    this._sNotiTp.getAll().subscribe({
      next:(data) => {
        this.lstNotiTp = data
      }
    })
  }

  getAllPlgrp(){
    this._sPlgrp.getAll().subscribe({
      next:(data) => {
        this.lstPlgrp = data
      }
    })
  }

  getAllEgGroup(){
    this._sEqGroup.getAll().subscribe({
      next:(data) => {
        this.lstEqGroup = data
      }
    })
  }

  getAllUser(){
    this._sAccount.getListUser().subscribe({
      next: (data) =>{
        this.lstUser = data
      }
    })
  }

   getAllWc(){
    this._sWc.getAll().subscribe({
      next: (data) =>{
        this.lstWc = data
      }
    })
  }

   getAllEquip(){
    this._sEquip.getAll().subscribe({
      next: (data) =>{
        this.lstEquip = data
      }
    })
  }

   updateStatusNoti(data: any, status: string) {
    data.statAct = status;
    this._sNoti.update(data).subscribe({
      next: () => {
        this.search();
      },
    });
  }

  getFullNameUser(username: any){
    return this.lstUser.find((x: { userName: string })  => x.userName == username)?.fullName
  }
  getNameWc(code: any){
    return this.lstWc.find(x => x.arbpl == code)?.arbplTxt;
  }

  getNameEquip(code: any){
    return this.lstEquip.find(x => x.equnr == code)?.eqktx;
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
