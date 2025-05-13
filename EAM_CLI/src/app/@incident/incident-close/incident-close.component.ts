import { Component, OnInit } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BaseFilter, PaginationResult } from '../../models/base.model';
import { GlobalService } from '../../service/global.service';
import { EquipService } from '../../service/master-data/equip.service';
import { FlocService } from '../../service/master-data/floc.service';
import { WcService } from '../../service/master-data/wc.service';
import { AccountService } from '../../service/system-manager/account.service';
import { NotiService } from '../../service/tran/noti.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-incident-close',
  imports: [ShareModule],
  templateUrl: './incident-close.component.html',
  styleUrl: './incident-close.component.scss'
})
export class IncidentCloseComponent implements OnInit {
  checked: boolean = false;
  filter = new BaseFilter();
  loading: boolean = false;
  paginationResult = new PaginationResult();
  lstFloc: any = [];
  lstUser: any = [];
  lstWc : any[] = [];
  lstEquip : any[] = [];

  constructor(
    private _sNoti: NotiService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private _sFloc: FlocService,
    private _sAccount: AccountService,
    private _sWc : WcService,
        private _sEquip : EquipService,
  ) {
    this.globalService.setBreadcrumb([
      {
        name: 'Đóng sự cố',
        path: 'incident/close',
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
  }
  search() {
    this._sNoti.searchClose(this.filter).subscribe({
      next: (data) => {
        this.paginationResult = data;
      },
      error: (response) => {
        console.log(response);
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

  updateStatusNoti(data: any, status: string) {
    data.statAct = status;

    Swal.fire({
      title: status =='05' ? 'Đóng sự cố?' : 'Từ chối đóng?',
      text: 'Bạn sẽ không thể hoàn tác điều này!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Huỷ'
    }).then((result) => {
      if (result.isConfirmed) {
        this._sNoti.update(data).subscribe({
      next: () => {
        this.search();
      },
    });
      }
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

