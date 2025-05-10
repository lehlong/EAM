import { Component, OnInit } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { BaseFilter, PaginationResult } from '../../models/base.model';
import { GlobalService } from '../../service/global.service';
import { NotiService } from '../../service/tran/noti.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FlocService } from '../../service/master-data/floc.service';
import { AccountService } from '../../service/system-manager/account.service';

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

  constructor(
    private _sNoti: NotiService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private _sFloc: FlocService,
    private _sAccount: AccountService
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

  getAllUser(){
    this._sAccount.getListUser().subscribe({
      next: (data) =>{
        this.lstUser = data
      }
    })
  }

  getFullNameUser(username: any){
    return this.lstUser.find((x: { userName: string })  => x.userName == username)?.fullName
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
